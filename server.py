import os.path
import random 
import hashlib
import shutil 
import json

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.locks
import tornado.gen

from tornado.options import define, options, parse_command_line
import traceback

from game import Game, Users, APIException

MAX_GAMES = 256


define("port", default=5556, help="run on the given port", type=int)
define("debug", default=True, help="run in debug mode")


totalGames = 0
adminControl = {'admin': None, 'gid': None}

with open('admin.json') as f:
    adminData = json.load(f)

#Some radnom helper function to make IDs
def hash_obj(obj, salt = '1c(R$p{Gsjk/5', add_random=False, algo=hashlib.sha256):
    """Returns a salted, optionally randomized, hash of str(obj)."""
    data = '%s%s%s' % (obj, salt, random.random() if add_random else '')
    return algo(data.encode('utf-8')).hexdigest()



class Commands(object):

    createRoom = 7
    enterRoom = 8



class RequestHandler(tornado.web.RequestHandler):

    USER_COOKIE_NAME = 'letters_user'

    def prepare(self):
        uid = self.get_cookie(self.USER_COOKIE_NAME)
        if not self.application.users.has_user(uid):
            if uid is None:
                uid = hash_obj(id(self), add_random=True)
                self.set_cookie(self.USER_COOKIE_NAME, uid)
            puid = hash_obj(uid, add_random=True)
            self.user = self.application.users.add_user(uid)
        else:
            self.user = self.application.users.get_user(uid)




class LoginHandler(RequestHandler):
    def get(self):
        self.render("login.html")

class LoginJSHandler(RequestHandler):

    def get(self):
        self.set_header('Content-Type', 'text/javascript')
        self.render('login.js', messageTypes = Commands)

class LoginCSSHandler(RequestHandler):

    def get(self):
        self.set_header('Content-Type', 'text/css')
        self.render('login.css')        
        
class gameLoginHandler(RequestHandler):
    def post(self):
        global totalGames
        
        
        tp = int(self.get_argument('type'))
        username = self.get_argument('nickname')
        roomname = self.get_argument('room')
        password = self.get_argument('password')
        
        if tp == Commands.createRoom:#To create a new room
        
            notFound = -1
            for i, gm in self.application.games.items():
                if gm.room_name == roomname :
                    notFound = i
                    break
                    
            if notFound != -1:
                #Room already exists
                self.write(json.dumps({'game':'exists'}))
            else:
                game = Game(self.user.user, password, roomname, totalGames)
                
                
                game.add_player(self.user, username)
                
                while totalGames in self.application.games: #Find an empty slot
                    totalGames = (totalGames+1)%MAX_GAMES
                
                self.user.gid = totalGames
                self.application.games[totalGames] = game
                
                
                self.write(json.dumps({'game':str(totalGames)}))
                ################## --------------------- COMMENT --------------------- ##################
                #print("Create romm:", roomname, password, username, totalGames)
                
                
                
                
            
        elif tp == Commands.enterRoom:#He is trying to enter room

            ################## --------------------- COMMENT --------------------- ##################
            #print(roomname, password)
            
            if username == 'admin' and roomname == adminData['admin'] and password == adminData['pass']:
                self.user.username = "ADMIN"
                self.user.admin = True
                self.write(json.dumps({'game':'admin'}))
            else:
                notFound = -1
                for i, gm in self.application.games.items():
                    if gm.room_name == roomname and gm.password == password:
                        ################## --------------------- COMMENT --------------------- ##################
                        #print('game exists, add him in')
                        notFound = i
                        break
                if notFound == -1:
                    self.write(json.dumps({'game':'na'}))
                else:
                    #add into game given by totalGames = i
                    blob = {'game':str(notFound)}
                    self.user.gid = notFound
                    self.application.games[notFound].add_player(self.user, username)
                    self.write(json.dumps(blob))
        else:
            #print(self.request.arguments)
            pass
            
        if adminControl['admin']:
            adminControl['admin'].sendStatus() #Send admin status
        
class gameBoardHandler(RequestHandler):
    def get(self):
        self.render('build/index.html')  


class webSocketHandler(RequestHandler, tornado.websocket.WebSocketHandler):
    def open(self):
    
        self.user.addSocketHandle(self)

        ################## --------------------- COMMENT --------------------- ##################
        #print("WebSocket opened", self.user.username)
    
    def on_message(self, message):
    

        if self.user.gid != -1:
            curr_game = self.application.games[self.user.gid]
            message = json.loads(message)
            curr_game.idle_state = 0
            
        else:
            message = {'type': 'redirect'}


        ################## --------------------- COMMENT --------------------- ##################
        print(self.user.username, ':', message['type']) #, message)
        
        
        
        if message['type'] == 'players':
            plyrs = {}
            for plyr in curr_game.players:
                plyrs[plyr] = curr_game.players[plyr].username
            
            if curr_game.state == 1:#If someone rejoins they have to go to next page directly
                self.sendMsg({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host, 'uid' :self.user.user, 'username':self.user.username})
                self.sendMsg({'type': 'startGame'})
                
            else:
                self.sendGameAll({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host}, curr_game)
        
        elif message['type'] == 'playerIn':
            if curr_game.state == 2:
                curr_game.refresh(self.user.user)
            
            plyrs = {}
            for plyr in curr_game.players:
                plyrs[plyr] = curr_game.players[plyr].username

            self.sendGameAll({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host}, curr_game)
                
            
        elif message['type'] == 'startGame':
            #Start the game
            curr_game.start_game(int(message['token_limit']), message['addExt']) #Options are number of hearts to win and if extraCards are wanted
            curr_game.new_round()
            self.sendGameAll({'type': 'startGame'}, curr_game)

        elif message['type'] == 'discard':
            try:
                curr_game.round.player_play(self.user.user, message['card'], message['player1'], message['player2'], message['number'])
            except APIException as e:
                print("API ERROR: ", e)
                self.sendMsg({'type':'error', 'err':str(e)})
            else:
                curr_game.round.round_state = 2 #Results are there show everyone
                for plyr in curr_game.players:
                    curr_game.players[plyr].webSocketHandle.sendMsg(curr_game.round.result_status(plyr))#Send everyone results 
            
        
        elif message['type'] == 'nextTurn':
            if (not (curr_game.round.result_blob['card_discarded'] == 'Bishop' and curr_game.round.result_blob['result'] == 'Correct')) or 'bishopAction' in curr_game.round.result_blob:
                curr_game.round.round_state = 1 #It is a players turn, send turn 

                for plyr in curr_game.players:
                    curr_game.players[plyr].webSocketHandle.sendMsg(curr_game.round.turn_status(plyr))
        
        elif message['type'] == 'ready': #TODO: Wait for everyone to click ready
            curr_game.all_in[self.user.user] = True

            if curr_game.roundOver and all(curr_game.all_in.values()): 
                curr_game.new_round() #Start the next round for everyone
                #And send everyone the turn status
                self.sendGameAll({'type':'readyAll'}, curr_game)

                for plyr in curr_game.players:
                    curr_game.all_in[plyr] = False 

        elif message['type'] == 'nextRound':
                if curr_game.round.round_state <= 1: #0 or 1
                    self.sendMsg(curr_game.round.turn_status(self.user.user))
                elif curr_game.round.round_state >= 2: #2 or 3
                    self.sendMsg(curr_game.round.result_status(self.user.user))
            
        elif message['type'] == 'bishopDiscard': #Option to allow discard card if required
            if message['toDiscard']:
                curr_game.round.player_discard(self.user.user)
                curr_game.round.result_blob['bishopAction'] = 'discard'
            else:
                curr_game.round.result_blob['bishopAction'] = 'nodiscard'
            
            
        elif message['type'] == 'leaveGame': #For player to leave the game    
            curr_game.remove_player(self.user.user)
            self.user.gid = -1

            plyrs = {}
            for plyr in curr_game.players:
                plyrs[plyr] = curr_game.players[plyr].username
            self.sendGameAll({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host}, curr_game)
            self.close()
            
        elif message['type'] == 'playComponent' or message['type'] == 'gameOptions' or message['type'] == 'cardinalView':
            for plyr in curr_game.players:
                if plyr != self.user.user:
                    curr_game.players[plyr].webSocketHandle.sendMsg(message)
        
        elif message['type'] == 'redirect':
            self.sendMsg(message)
            self.close()
        else:
            print("UNKNOWN MESSAGE: ", message)
            
        
        #Send admin details
        if adminControl['admin'] and adminControl['gid'] == self.user.gid:
            adminControl['admin'].sendStatus()
        
    def on_close(self):
        ################## --------------------- COMMENT --------------------- ##################
        print("WebSocket closed: ", self.user.username)
        self.user.removeSocketHandle()

    def sendGameAll(self, msg, curr_game):
        if adminControl['admin'] and adminControl['gid'] == self.user.gid:
            adminControl['admin'].sendStatus()
            
        
        for plyr in curr_game.players.values():
            if plyr.webSocketHandle != None:
                msg['uid'] = plyr.user
                msg['username'] = plyr.username
                plyr.webSocketHandle.sendMsg(msg)

    def sendMsg(self, message):
        try:
            self.write_message(json.dumps(message))
        except tornado.websocket.WebSocketClosedError as e:
            print("WebSocket ERROR: ", e)
            traceback.print_tb(e.__traceback__)
            self.close()
            

class adminHandler(RequestHandler):

    def get(self):
        if self.user.admin:
            print('AdminControl OPENED')
            self.render('admin.html')
        else:
            self.redirect('/')
        


class wsAdminControlHandler(RequestHandler, tornado.websocket.WebSocketHandler):

        
    def open(self):
        print('AdminControl WebSocket OPENED')
        adminControl['admin'] = self
        adminControl['gid'] = 0
        
        self.sendStatus()
        
    def sendStatus(self):
        blob = {'totGames': len(self.application.games), 'games':list(self.application.games.keys())}
        if adminControl['gid']!= None and adminControl['gid'] in self.application.games:
            blob.update(self.application.games[adminControl['gid']].curr_status())
            blob['gid'] = adminControl['gid']
            blob['roomname'] = self.application.games[adminControl['gid']].room_name
        else:
            blob['game'] = None
        # print(blob, adminControl)
        self.sendMsg(blob)
        
    def on_close(self):
        print('AdminControl WebSocket CLOSED')
        adminControl['admin'] = None
        adminControl['gid'] = None
        
        self.user.admin = False
        
    def on_message(self, message):
        print("ADMIN: ", message)
        message = json.loads(message)
        
        if message['type'] == 'viewGame':
            adminControl['gid'] = int(message['gid'])
            self.sendStatus()
            
        
    def sendMsg(self, message):
        try:
            self.write_message(json.dumps(message))
        except tornado.websocket.WebSocketClosedError as e:
            print("WebSocket ERROR: ", e)
            self.close()
        
    
class Application(tornado.web.Application):

    def __init__(self, *args, **kwargs):
        self.games = {}
        self.users = Users()

        super(Application, self).__init__(*args, **kwargs)

        react_build_dir = os.path.join(os.path.dirname(__file__), "react", "game", "build")
        python_build_dir = os.path.join(os.path.dirname(__file__), "templates", "build")
        
        #if os.path.exists(python_build_dir):
        #    shutil.rmtree(python_build_dir)
        #shutil.copytree(react_build_dir, python_build_dir) 

settings = dict(
        cookie_secret="SX4gE3etDbVr0vbfdsFDSMl",
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "templates/build/static"),
        
        websocket_ping_interval=60
)




handlers = [
        (r'/', LoginHandler),
        (r'/login.js', LoginJSHandler),
        (r'/login.css', LoginCSSHandler),
        (r"/getGame", gameLoginHandler),
        (r"/gameBoard", gameBoardHandler),
        (r"/ws", webSocketHandler),
        
        (r"/adminControl", adminHandler),
        (r"/wsAdminControl",wsAdminControlHandler)
      
]
if __name__ == "__main__":
    app = Application(handlers, **settings)
    app.listen(options.port)
    
    def check_idle():
        remove = [k for k in app.games if app.games[k].idle_state == 2]
        print("CLEARING: ", remove)
        for k in remove:
            app.games[k].closing()
            del app.games[k]
        
        for k, gms in app.games.items():
            gms.idle_state += 1
    
    tornado.ioloop.PeriodicCallback(check_idle, 1000*60*5).start() #Every 5 minutes check idle state of games
    tornado.ioloop.IOLoop.current().start()

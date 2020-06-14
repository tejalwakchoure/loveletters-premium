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
from game import Game, Users

import socketio


define("port", default=5556, help="run on the given port", type=int)
define("debug", default=True, help="run in debug mode")


totalGames = 0




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
                
                self.user.gid = totalGames
                
                game.add_player(self.user, username)
                self.application.games[totalGames] = game
                self.write(json.dumps({'game':str(totalGames)}))
                print("Create romm:", roomname, password, username, totalGames)
                totalGames += 1
                
                
                
            
        elif tp == Commands.enterRoom:#He is trying to enter room

            print(roomname, password)
            
            notFound = -1
            for i, gm in self.application.games.items():
                if gm.room_name == roomname and gm.password == password:
                    print('game exists, add him in')
                    notFound = i
                    break
                    
            if notFound == -1:
                self.write(json.dumps({'game':'na'}))
            else:
                #add into game given by totalGames = i
                blob = {'game':str(notFound)}
                
                self.user.gid = notFound
                    
                self.application.games[notFound].add_player(self.user, username)
                
                #players = {}
                
                #for i in self.application.games[notFound].players:
                #    players.update({'name': i.name , 'color': i})
                
                #blob.update({'players':players})
                
                
                
                self.write(json.dumps(blob))
        else:
            print(self.request.arguments)
        
        
class gameBoardHandler(RequestHandler):
    def get(self):
        self.render('build/index.html')  


class webSocketHandler(RequestHandler, tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened", self.user.username)
        self.user.addSocketHandle(self)

    def on_message(self, message):
        
        curr_game = self.application.games[self.user.gid]
        message = json.loads(message)
        print(self.user.username, ':', message)
        
        if message['type'] == 'players':
            plyrs = {}
            for plyr in curr_game.players:
                plyrs[plyr] = curr_game.players[plyr].username
            self.sendGameAll({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host}, curr_game)
            
            if curr_game.state == 1:#If someone rejoins they have to go to next page directly
                self.write_message(json.dumps({'type': 'startGame'}))
                #self.write_message(json.dumps(curr_game.round.turn_status(self.user.user)))
            
        elif message['type'] == 'startGame':
            #Start the game
            curr_game.start_game()
            self.sendGameAll({'type': 'startGame'}, curr_game)

        elif message['type'] == 'discard':
            curr_game.round.player_play(message['card'], message['player1'], message['player2'], message['number'])
            
            for plyr in curr_game.players:
                curr_game.players[plyr].webSocketHandle.write_message(json.dumps(curr_game.round.result_status(plyr)))#Send everyone status
            
        
        elif message['type'] == 'nextTurn':
            for plyr in curr_game.players:
                curr_game.players[plyr].webSocketHandle.write_message(json.dumps(curr_game.round.turn_status(plyr)))
        
        elif message['type'] == 'nextRound':
            if curr_game.roundOver: 
                curr_game.new_round() #Start the next round for everyone
            
            self.write_message(json.dumps(curr_game.round.turn_status(self.user.user)))

        elif message['type'] == 'bishopDiscard': #Option to allow discard card if required
            curr_game.round.player_discard(self.user.user)
            self.write_message(json.dumps(curr_game.round.turn_status(self.user.user)))
            
        elif message['type'] == 'leaveGame': #For player to leave the game    
            del cur_game.players[self.user.user]
            self.user.gid = -1
            plyrs = {}
            for plyr in curr_game.players:
                plyrs[plyr] = curr_game.players[plyr].username
            self.sendGameAll({'type':'playersS', 'plyrs':plyrs, 'host':curr_game.host}, curr_game)
            
            

    def on_close(self):
        print("WebSocket closed:", self.user.username)

    def sendGameAll(self, msg, curr_game):
        for plyr in curr_game.players.values():
            msg['uid'] = plyr.user
            msg['username'] = plyr.username
            plyr.webSocketHandle.write_message(json.dumps(msg))        


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
)




handlers = [
        (r'/', LoginHandler),
        (r'/login.js', LoginJSHandler),
        (r'/login.css', LoginCSSHandler),
        (r"/getGame", gameLoginHandler),
        (r"/gameBoard", gameBoardHandler),
        (r"/ws", webSocketHandler)
      
]
if __name__ == "__main__":
    app = Application(handlers, **settings)
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()

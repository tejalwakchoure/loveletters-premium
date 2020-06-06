import os.path
import random 
import hashlib

import json

import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.locks
import tornado.gen

from tornado.options import define, options, parse_command_line
from game import Game

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

    USER_COOKIE_NAME = 'dixit_user'

    def prepare(self):
        uid = self.get_cookie(self.USER_COOKIE_NAME)
        if uid in self.application.users:
            if uid is None:
                uid = hash_obj(id(self), add_random=True)
                self.set_cookie(self.USER_COOKIE_NAME, uid)
            self.user = uid #self.application.users.add_user(uid)
        else:
            self.user = uid #self.application.users.get_user(uid)
            
        self.application.users.append(uid)
        


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
                if gm.name == roomname :
                    notFound = i
                    break
                    
            if notFound != -1:
                #Room already exists
                self.write(json.dumps({'game':'exists'}))
            else:
                game = Game(self.user, password, roomname)
                
                #self.user.gid = totalGames
                
                game.add_player(self.user, username)
                self.application.games[totalGames] = game
                self.write(json.dumps({'game':str(totalGames)}))
                totalGames += 1
                
                #ADDING EXTRA PLAYERS TO HELP TEST
                #x1 = self.application.users.add_user('2dfsgsdfg', '2dsgsdfg')
                #x2 = self.application.users.add_user('3dfgsfdfg', '3dfgdfgd')
                #x3 = self.application.users.add_user('4dsfgsdfg', '4fsfoias')
                #game.add_player(x1, display.BunnyPalette.allColors[1])
                #game.add_player(x2, display.BunnyPalette.allColors[2])
                #game.add_player(x3, display.BunnyPalette.allColors[3])
                print("Create romm:", roomname, password, username)
                
                
            
        elif tp == Commands.enterRoom:#He is trying to enter room

            print(roomname, password)
            
            notFound = -1
            for i, gm in self.application.games.items():
                if gm.room_name == roomname and gm.password == password:
                    print('game exists, add him in', i, gm.room_name, gm.password)
                    notFound = i
                    break
                    
            if notFound == -1:
                self.write(json.dumps({'game':'na'}))
            else:
                #add into game given by totalGames = i
                blob = {'game':str(notFound)}
                
                #self.user.gid = notFound
                    
                self.application.games[notFound].add_player(self.user, username)
                
                #players = {}
                
                #for i in self.application.games[notFound].players:
                #    players.update({'name': i.name , 'color': i})
                
                #blob.update({'players':players})
                
                
                
                self.write(json.dumps(blob))
        else:
            print(self.request.arguments)
        
        
class Application(tornado.web.Application):

    def __init__(self, *args, **kwargs):
        self.games = {}
        self.users = []

        super(Application, self).__init__(*args, **kwargs)
        
settings = dict(
        cookie_secret="SX4gE3etDbVr0vbfdsFDSMl",
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
)


handlers = [
        (r'/', LoginHandler),
        (r'/login.js', LoginJSHandler),
        (r'/login.css', LoginCSSHandler),
        (r"/getGame", gameLoginHandler)
      
]

if __name__ == "__main__":
    app = Application(handlers, **settings)
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()
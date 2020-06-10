import random
import copy


class Card:
    def __init__(self, card_number, card_name, card_desc):
        self.card_number = card_number
        self.card_name = card_name
        self.card_desc = card_desc
        
        


allCards = [Card(8, 'Princess', ''),
            Card(7, 'Countess', ''),
            Card(6, 'King', ''),
            Card(5, 'Prince', ''),
            Card(5, 'Prince', ''),
            Card(4, 'Handmaid', ''),
            Card(4, 'Handmaid', ''),
            Card(3, 'Baron', ''),
            Card(3, 'Baron', ''),
            Card(2, 'Priest', ''),
            Card(2, 'Priest', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', '')
            ]
            
extCards = [Card(9, 'Bishop', ''),
            Card(7, 'Dowager Queen', ''),
            Card(6, 'Constable' , ''),
            Card(5, 'Count', ''),
            Card(5, 'Count', ''),
            Card(4, 'Sycophant', ''),
            Card(4, 'Sycophant', ''),
            Card(3, 'Baroness', ''),
            Card(3, 'Baroness', ''),
            Card(2, 'Cardinal', ''),
            Card(2, 'Cardinal', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', ''),
            Card(1, 'Guard', ''),
            Card(0, 'Assassin', ''),
            Card(0, 'Jester', '')
            ]

        
class Player:
    def __init__(self, uid):
        self.user = uid
        self.reset()
        self.tokens = 0
        
        self.webSocketHandle = None

        self.gid = -1
        
        self.username = 'random' + uid[:5]
        
    def set_username(self, name):
        self.username = name
        
    def addSocketHandle(self, sock):
        self.webSocketHandle = sock


    def reset(self):
        self.card = None
        
        self.extra = None
        
        self.immune = False
        self.sycho = False
        self.out = False
        self.discard_pile = []
        
        self.dis_const = 0
        self.dis_count = 0
        
        self.end_count = 0
        self.sum = 0
        
    def discard_sum(self):
        sum = 0
        
        for card in self.discard_pile:
            sum += card.card_number
            
        self.sum = sum

    def __lt__(self, other):
        if self.end_count == other.end_count:
            return self.sum < other.sum
        else:
            return self.end_count < other.end_count
            
class Users():
    def __init__(self):
        self.users = {}
    
    def __iter__(self):
        return iter(self.users.values())
    
    def has_user(self, uid):
        return uid in self.users

    def get_user(self, uid):
        return self.users[uid]
        
    def add_user(self, uid):
        user = Player(uid)
        self.users[uid] = user
        return user
    
class Round:
    def __init__(self, game_super, players, order, cards, starter):
        self.players = players
        self.order = order
        self.cards = cards
        self.winner = None
        
        self.discard_pile = []
        
        self.sychoTar = None
        
        self.jesterTar = None
        self.jesterBet = None
        #TODO: Targets 

        self.result_blob = {}
        
        
        self.super_game = game_super
        
        random.shuffle(self.cards)
        self.top_card = self.cards.pop()
        
        for plyr in self.order:
            self.players[plyr].reset()
            self.players[plyr].card = self.cards.pop()
        
        self.turn = self.order[starter]
        self.turn_no = starter
        self.player_turn()
        
    def player_turn(self):
        if self.players[self.turn].immune:#If it's come back a round, you are no longer immune
            self.players[self.turn].immune = False
        if self.sychoTar != None and self.discard_pile[-1].card_name != 'Sycophant': #If it's been a turn after Sycophant then no more target
            self.sychoTar = None
        
        self.players[self.turn].extra = self.cards.pop() #Give player a card to choose from
        
        #TODO: if it's a Countess with a prince or King, has to discard the Countess


        ################
        self.curr_stat()
        
    def turn_status(self, plyr_uid):
        obj = {}
        obj['type'] = 'turn'
        obj['player'] = self.turn
        if self.turn == plyr_uid:
            obj['cards'] = [self.players[self.turn].card.card_name, self.players[self.turn].extra.card_name]
        else:
            obj['cards'] = [self.players[plyr_uid].card.card_name]
        obj['sycho'] = []
        if self.sychoTar != None:
            obj['sycho'].append(self.sychoTar)
        
        #THIS WAS ADDED FOR TESTING REMOVE 
        for plyr in self.order:
            if plyr != plyr_uid:
                obj['sycho'].append(plyr)
                break
        
        obj['immune'] = []
        for plyr in self.order:
            if self.players[plyr].immune:
                obj['immune'].append(plyr)
    
        obj['eliminated'] = []
        for plyr in self.players.values():
            if plyr.out:
                obj['eliminated'].append(plyr.user)
        
        return obj

        
        
    def player_play(self, card_chosen, plyr1, plyr2, numb_given): #TODO RETURN A PROPER RESULT HERE OF WHAT HAS HAPPENED
        
        self.result_blob = {'roundOver': False, 'gameOver': False} #to return this somehow

        if plyr1 != None and self.players[plyr1].out:
            raise Exception("Hello Sir, what is this, plyr1 is out, unacceptable") 

        if plyr2 != None and self.players[plyr2].out:
            raise Exception("Hello Sir, what is this, plyr2 is out, unacceptable") 
        
        if self.sychoTar != None and plyr1 != self.sychoTar:
            raise Exception('Theres a sychoTarget which has not been taken')
            
        if  plyr1 != None and self.players[plyr1].immune:
            raise Exception('Plyr1 is immune')
            
        if  plyr2 != None and self.players[plyr2].immune:
            raise Exception('Plyr2 is immune')
        
        if card_chosen == self.players[self.turn].card.card_name:#Chose his normal card
            card_discarded = self.players[self.turn].card
            self.players[self.turn].card = self.players[self.turn].extra
            self.players[self.turn].extra = None
            
        elif card_chosen == self.players[self.turn].extra.card_name:#Chose the extra one
            card_discarded = self.players[self.turn].extra
            self.players[self.turn].extra = None
            
        else: #He's chosen a card that does not exist
            raise Exception("Unknown card chosen??")
            
        self.players[self.turn].discard_pile.append(card_discarded)
        self.discard_pile.append(card_discarded)
        

        self.result_blob['card_discarded'] = card_discarded.card_name #Which card was played
        self.result_blob['eliminated'] = []

        self.player_play_card(card_discarded, plyr1, plyr2, numb_given)

        if self.check_win():
            self.result_blob['roundOver'] = True
            self.result_blob['roundWinner'] = self.winner
            
            
            self.players[self.winner].tokens += 1
            self.super_game.end_round()
        else:
            self.turn_no = (self.turn_no + 1) % len(self.order)
            self.turn = self.order[self.turn_no]
            self.player_turn()
        
        return self.result_blob
        
    def player_play_card(self, played_card, plyr1, plyr2, numb_given):
        #Check each condition and do acordingly

        
        if played_card.card_name == 'Bishop': #Check number and player, if match gain an affection token
            if self.players[plyr1].card.card_number == numb_given:
                self.players[self.turn].tokens += 1
                self.super_game.check_winner()
                #TODO: Give player option to discard
        
        elif played_card.card_name == 'Princess': #Player is knocked out immediately
            self.knockout_player(self.turn)
        
        elif played_card.card_name == 'Countess': #Nothing happens
            pass
        
        elif played_card.card_name == 'Dowager Queen': #Players have to copmare and GREATER ONE is out
            if self.players[plyr1].card.card_number > self.players[self.turn].card.card_number: #plyr1 is out
                self.knockout_player(plyr1)
            elif self.players[plyr1].card.card_number < self.players[self.turn].card.card_number: #current plyr is out
                self.knockout_player(self.turn)
            #Nothing on tie
            
        elif played_card.card_name == 'King': #Exchange cards with chosen player
            self.player_trade(self.turn, plyr1)
        
        elif played_card.card_name == 'Constable': #Nothing happens on discard
             self.players[self.turn].dis_const += 1
            
        elif played_card.card_name == 'Prince': #Chosen player discards current card
            self.player_discard(plyr1)
            
        elif played_card.card_name == 'Count': #Nothing happens on discard
            self.players[self.turn].dis_count += 1
            
        elif played_card.card_name == 'Handmaid': #Immunity granted
            self.players[self.turn].immune = True
        
        elif played_card.card_name == 'Sycophant':
            self.players[plyr1].sycho = True
            self.sychoTar = plyr1
        
        elif played_card.card_name == 'Baron':#Players have to copmare and LESSER ONE is out
            if self.players[plyr1].card.card_number < self.players[self.turn].card.card_number: #plyr1 is out
                self.knockout_player(plyr1)
            elif self.players[plyr1].card.card_number > self.players[self.turn].card.card_number: #current plyr is out
                self.knockout_player(self.turn)
            #Nothing on tie
        
        elif played_card.card_name == 'Baroness': #plyr1 and plyr2 have to be revealed 
            pass #TODO HERE
            
        elif played_card.card_name == 'Cardinal': #Two people  exchange
            self.player_trade(plyr1, plyr2)
            # TODO: Reveal one card 
            
        elif played_card.card_name == 'Priest': #Reveal card here
            pass #TODO
            
        elif played_card.card_name == 'Guard': #Number and player revealed
            if self.players[plyr1].card.card_name == 'Assassin':
                self.knockout_player(self.turn)
                self.player_discard(plyr1) #Discard the assassin
                
            elif self.players[plyr1].card.card_number == numb_given:
                self.knockout_player(plyr1)
        
        elif played_card.card_name == 'Jester': #A bet has been made
            self.jesterTar = plyr1
            self.jesterBet = self.turn
            
        elif played_card.card_name == 'Assassin': #Nothing to do here
            pass
            
        
        
        
        
    def player_discard(self, plyr):#Chosen player has to discard a card, probably also take a new one
        
        
        if self.players[plyr].card.card_name == 'Princess':
            self.knockout_player(plyr)
        else:
            self.players[plyr].discard_pile.append(self.players[plyr].card)
            self.discard_pile.append(self.players[plyr].card)

        if not self.players[plyr].out:
            if(self.cards):
                self.players[plyr].card = self.cards.pop()
            else:
                self.players[plyr].card = self.top_card
        
    def player_trade(self, plyr1, plyr2):
        temp_card = self.players[plyr1].card
        self.players[plyr1].card = self.players[plyr2].card
        self.players[plyr2].card = temp_card
        
    def knockout_player(self, plyr):
        self.order.remove(plyr)
        self.players[plyr].out = True
        self.players[plyr].tokens += self.players[plyr].dis_const

        self.players[plyr].discard_pile.append(self.players[plyr].card)
        self.discard_pile.append(self.players[plyr].card)

        ##################
        self.result_blob['eliminated'].append(plyr)
        print(plyr + " HAS BEEN ELIMINATED")

        
    def check_win(self):
        fin_players = []
        win = False
        if len(self.order) == 1: #only one player is left, he wins
            self.winner = self.order[0]
            win =  True
            
        if len(self.cards) == 0:
            #To check final winner here
            for plyr in self.order:
                self.players[plyr].end_count = self.players[plyr].card.card_number + self.players[plyr].dis_count
                self.players[plyr].discard_sum()
                fin_players.append(self.players[plyr])
            
            fin_players.sort() #Sort the players
            if fin_players[0].card_name == 'Bishop' and fin_players[1].card_name == "Princess":
                # 1 is the winner not zero 
                self.winner = fin_players[1].user
            else:
                self.winner = fin_players[0].user
            win = True
            #Exceptions in tie or otherwise
            #Princess always beats Bishop(no matter Counts)
        
        if win:
            if self.winner == self.jesterTar: #If the bet made by the joker was correct, give the token
                self.players[self.jesterBet].tokens += 1
        return win
        
    def curr_stat(self):
        print(self.order)
        
        for plyrs in self.order:
            print(self.players[plyrs].username + ':' + self.players[plyrs].card.card_name + '\t\t' + str(self.players[plyrs].card.card_number) + '\t' + str(self.players[plyrs].tokens))
        
        #print(self.result_blob)
        print(self.turn_status(self.turn))

        print(self.players[self.turn].username + ' has ' + self.players[self.turn].extra.card_name + ' and ' + self.players[self.turn].card.card_name + ' to play')
        


class Game:
    def __init__(self, host, password, room_name, gid):
        self.host = host
        self.room_name = room_name
        self.password = password
        
        self.gid = gid
        
        self.state = 0 #Not started
        
        self.players = {}
        self.order = []
        self.round = None
        self.cards = allCards
        self.overall_winner = None
        
    def add_player(self, user, username):
        if self.state != 0:
            print('Can\'t add already started')
            return
            
        if not user in self.players:  
            user.set_username(username)
            self.players[user.user] = user
            self.order.append(user.user)
        else:
            raise Exception("player alreay exists")
            
    def start_game(self):
        if self.state != 0:
            print("Already started")
            return
        
        self.state = 1
        random.shuffle(self.order)
        if len(self.order) > 4:
            self.cards.extend(extCards)
            
        self.round = Round(self, self.players, copy.deepcopy(self.order), copy.deepcopy(self.cards), random.randint(0, len(self.order)-1))
            
        
    def check_winner(self):
        for plyr in self.players:
            if self.players[plyr].tokens == 4:
                self.end_round(False)
                self.overall_winner = plyr
                self.state = 0
                return True
        return False
        
    def end_round(self, new = True):
        if new and not self.check_winner():
            
            winner_no = 0
            for x in self.order:
                if self.round.winner == x:
                    break
                winner_no += 1
                
            self.round = Round(self, self.players, copy.deepcopy(self.order), copy.deepcopy(self.cards), winner_no)
        else:
            self.round = None

#For testing
if __name__ == '__main__':
    game = Game('moi', 'name', 'pass', 0)
    game.add_player(Player('qwe'), 'a')
    game.add_player(Player('asd'), 'b')
    game.add_player(Player('zxc'), 'c')
    game.add_player(Player('rty'), 'd')
    game.add_player(Player('fgh'), 'e')


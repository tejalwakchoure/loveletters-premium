import random
import copy

class APIException(Exception):
    pass


class Card:
    def __init__(self, card_number, card_name, card_desc, select = 0, numb = False):
        self.card_number = card_number
        self.card_name = card_name
        self.card_desc = card_desc
        
        
        self.requires_people = select
        self.requires_numb = numb
        


allCards = [Card(8, 'Princess', ''),
            Card(7, 'Countess', ''),
            Card(6, 'King', '', 1),
            Card(5, 'Prince', '', 1),
            Card(5, 'Prince', '', 1),
            Card(4, 'Handmaid', ''),
            Card(4, 'Handmaid', ''),
            Card(3, 'Baron', '', 1),
            Card(3, 'Baron', '', 1),
            Card(2, 'Priest', '', 1),
            Card(2, 'Priest', '', 1),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True)
            ]
            
extCards = [Card(9, 'Bishop', '', 1, True),
            Card(7, 'Dowager Queen', '', 1),
            Card(6, 'Constable' , ''),
            Card(5, 'Count', ''),
            Card(5, 'Count', ''),
            Card(4, 'Sycophant', '', 1),
            Card(4, 'Sycophant', '', 1),
            Card(3, 'Baroness', '', 1),
            Card(3, 'Baroness', '', 1),
            Card(2, 'Cardinal', '', 2),
            Card(2, 'Cardinal', '', 2),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True),
            Card(1, 'Guard', '', 1, True),
            Card(0, 'Assassin', ''),
            Card(0, 'Jester', '', 1)
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
        self.dis_sum = 0
        
    def discard_sum(self):
        sum = 0
        
        for card in self.discard_pile:
            sum += card.card_number
            
        self.dis_sum = sum

    def __lt__(self, other):
        if self.end_count == other.end_count:
            return self.dis_sum < other.dis_sum
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

        self.result_blob = {}
        
        
        self.super_game = game_super
        
        random.shuffle(self.cards)
        self.top_card = self.cards.pop()

        # if len(self.players) == 2:
        #     #Discard 3 more cards
        #     self.discard_pile.append(self.cards.pop())
        #     self.discard_pile.append(self.cards.pop())
        #     self.discard_pile.append(self.cards.pop())
        
        for plyr in self.order:
            self.players[plyr].reset()
            self.players[plyr].card = self.cards.pop()
        
        self.turn = self.order[starter]
        self.turn_no = starter

        self.round_state = 0

        self.player_turn()
        
    def player_turn(self):
        if self.players[self.turn].immune:#If it's come back a round, you are no longer immune
            self.players[self.turn].immune = False
        if self.sychoTar != None and self.discard_pile[-1] != 'Sycophant': #If it's been a turn after Sycophant then no more target
            self.sychoTar = None

        
        
        self.players[self.turn].extra = self.cards.pop() #Give player a card to choose from
        
        #TODO: if it's a Countess with a prince or King, has to discard the Countess


        ################## --------------------- COMMENT --------------------- ##################
        #self.curr_stat()
        
    def player_play(self, card_chosen, plyr1, plyr2, numb_given):
        #Raise exceptions if something is wrong
        if plyr1 != None and self.players[plyr1].out:
            raise APIException("Hello Sir, what is this, plyr1 is out, unacceptable") 

        if plyr2 != None and self.players[plyr2].out:
            raise APIException("Hello Sir, what is this, plyr2 is out, unacceptable") 
        
        if self.sychoTar != None and plyr1 != self.sychoTar:
            raise APIException('Theres a sychoTarget which has not been taken')
            
        if  plyr1 != None and self.players[plyr1].immune:
            raise APIException('Plyr1 is immune')
            
        if  plyr2 != None and self.players[plyr2].immune:
            raise APIException('Plyr2 is immune')
            
        self.result_blob = {} 
        
        
        #Discard card and make the other card available as 'card' attribute
        if card_chosen == self.players[self.turn].card.card_name:#Chose his normal card
            card_discarded = self.players[self.turn].card
            self.players[self.turn].card = self.players[self.turn].extra
            
        elif card_chosen == self.players[self.turn].extra.card_name:#Chose the extra one
            card_discarded = self.players[self.turn].extra
            
        else: #He's chosen a card that does not exist
            raise APIException("Unknown card chosen??" + card_chosen)
            
            
        self.players[self.turn].extra = None
        
        #Add to discard piles

        self.players[self.turn].discard_pile.append(card_discarded)
        self.discard_pile.append(card_discarded.card_name)
        

        self.result_blob['card_discarded'] = card_discarded.card_name #Which card was played
        
        self.result_blob['player'] = self.turn
        self.result_blob['plyr1'] = plyr1
        self.result_blob['plyr2'] = plyr2
        self.result_blob['number'] = numb_given
        
        
        self.result_blob['eliminated'] = []
        
        self.result_blob['gameWinner'] = None
        if self.result_blob['plyr1'] != None:
            self.result_blob['card1'] = self.players[plyr1].card.card_name
        else:
            self.result_blob['card1'] = None
            
        
        if self.result_blob['plyr2'] != None:
            self.result_blob['card2'] = self.players[plyr2].card.card_name
        else:
            self.result_blob['card2'] = None
        
        self.result_blob['result'] = None
        
        #Play the cards
        try:
            self.player_play_card(card_discarded, plyr1, plyr2, numb_given)
        except APIException as e:
            print("Card was discarded without effect")
            self.result_blob['result'] = 'x'
            print("ERROR: ", e, " ---------------------------------------------------")
        


        if self.check_win():
            #Round is over, wait for next round to start
            self.round_state = 3 #Round is over
            self.result_blob['roundWinner'] = self.winner
            self.result_blob['finalCards'] = {}
            for plyr in self.players:
                if plyr in self.order:
                    self.result_blob['finalCards'][plyr] = self.players[plyr].card.card_name
                else:
                    self.result_blob['finalCards'][plyr] = None

            self.players[self.winner].tokens += 1
            self.super_game.roundOver = True
            self.super_game.prev_winner_no = self.super_game.order.index(self.winner)
            self.super_game.check_winner()
            
        else:#Play next turn
            self.result_blob['roundWinner'] = None
            #Have to check some conditions here
            #When someone is outed they can be either before or after current player in order or the current player himself
            #If before or current player is puted then turn_no should remain same
            #else it should go ahead
            
            if self.turn_no == len(self.order):
                self.turn_no = 0
            elif self.order[self.turn_no] == self.turn: 
                self.turn_no = (self.turn_no + 1) % len(self.order)
                
            self.turn = self.order[self.turn_no]
            self.player_turn()
        
        
        
    def player_play_card(self, played_card, plyr1, plyr2, numb_given):
        #Check each condition and do acordingly
        if played_card.requires_numb and numb_given == None:
            raise APIException("Number required was not given")

        if played_card.requires_people == 1 and plyr1 == None:
            raise APIException("Player 1 was required not given")
        
        if played_card.requires_people == 2 and plyr2 == None:
            raise APIException("Player 2 was required not given")

        if played_card.card_name == 'Bishop': #Check number and player, if match gain an affection token
            if self.players[plyr1].card.card_number == numb_given:
                self.players[self.turn].tokens += 1
                self.result_blob['result'] = 'Correct'
                self.super_game.check_winner()
                #TODO: Give player option to discard
            else:
                self.result_blob['result'] = 'Incorrect'
        
        elif played_card.card_name == 'Princess': #Player is knocked out immediately
            self.knockout_player(self.turn)
        
        elif played_card.card_name == 'Countess': #Nothing happens
            pass
        
        elif played_card.card_name == 'Dowager Queen': #Players have to copmare and GREATER ONE is out
            if self.players[plyr1].card.card_number > self.players[self.turn].card.card_number: #plyr1 is out
                self.result_blob['card1'] = self.players[self.turn].card.card_name
                self.result_blob['card2'] = self.players[plyr1].card.card_name
                self.knockout_player(plyr1)
            elif self.players[plyr1].card.card_number < self.players[self.turn].card.card_number: #current plyr is out
                self.result_blob['card2'] = self.players[self.turn].card.card_name
                self.result_blob['card1'] = self.players[plyr1].card.card_name
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
            self.result_blob['result'] = 'sychoTar'
        
        elif played_card.card_name == 'Baron':#Players have to copmare and LESSER ONE is out
            if self.players[plyr1].card.card_number < self.players[self.turn].card.card_number: #plyr1 is out
                self.result_blob['card1'] = self.players[self.turn].card.card_name
                self.result_blob['card2'] = self.players[plyr1].card.card_name
                self.knockout_player(plyr1)
            elif self.players[plyr1].card.card_number > self.players[self.turn].card.card_number: #current plyr is out
                self.result_blob['card2'] = self.players[self.turn].card.card_name
                self.result_blob['card1'] = self.players[plyr1].card.card_name
                self.knockout_player(self.turn)
            #Nothing on tie
        
        elif played_card.card_name == 'Baroness': #plyr1 and plyr2 have to be revealed 
            pass #TODO HERE
            
        elif played_card.card_name == 'Cardinal': #Two people  exchange
            self.player_trade(plyr1, plyr2)
            self.result_blob['card1'] = self.players[plyr1].card.card_name
            self.result_blob['card2'] = self.players[plyr2].card.card_name
            # TODO: Reveal one card 
            
        elif played_card.card_name == 'Priest': #Reveal card here
            pass #TODO
            
        elif played_card.card_name == 'Guard': #Number and player revealed
            if self.players[plyr1].card.card_name == 'Assassin':
                self.knockout_player(self.turn)
                self.result_blob['result'] = 'Assassin'
                self.player_discard(plyr1) #Discard the assassin
                
            elif self.players[plyr1].card.card_number == numb_given:
                self.knockout_player(plyr1)
                self.result_blob['result'] = 'Correct'
            
            else:
                self.result_blob['result'] = 'Incorrect'
        
        elif played_card.card_name == 'Jester': #A bet has been made
            self.jesterTar = plyr1
            self.jesterBet = self.turn
            self.result_blob['result'] = 'jesterBet'
            
        elif played_card.card_name == 'Assassin': #Nothing to do here
            pass
            
        
    def player_discard(self, plyr):#Chosen player has to discard a card, probably also take a new one
        if self.players[plyr].card.card_name == 'Princess':
            self.knockout_player(plyr)
        else:
            self.players[plyr].discard_pile.append(self.players[plyr].card)
            self.discard_pile.append(self.players[plyr].card.card_name)

        if not self.players[plyr].out:
            if self.cards:
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
        
        if len(self.order) != 1:
            self.super_game.check_winner()

        self.players[plyr].discard_pile.append(self.players[plyr].card)
        self.discard_pile.append(self.players[plyr].card.card_name)

        self.result_blob['eliminated'].append(plyr)
        
        ################## --------------------- COMMENT --------------------- ##################
        #print(plyr + " HAS BEEN ELIMINATED")

        
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
            
            fin_players = sorted(fin_players, reverse=True) #Sort the players
            
            #############
            print("FINAL STANDINGS")
            print([(plyr.username,plyr.card.card_name, plyr.end_count, plyr.dis_sum) for plyr in fin_players]) 
            
            if fin_players[0].card.card_name == 'Bishop' and fin_players[1].card.card_name == "Princess":
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
        
        ################## --------------------- COMMENT --------------------- ##################
        #for plyr in self.order:
        #    if plyr != plyr_uid:
        #        obj['sycho'].append(plyr)
        #        break
        
        obj['immune'] = []
        for plyr in self.order:
            if self.players[plyr].immune:
                obj['immune'].append(plyr)
    
        obj['eliminated'] = []
        for plyr in self.players.values():
            if plyr.out:
                obj['eliminated'].append(plyr.user)
        
        
        obj['prevTurn'] = self.msg_status(plyr_uid)
        obj['discard_pile'] = self.discard_pile
        
        return obj
    
    def result_status(self, plyr_uid):
        obj = {}
        
        #Stuff the front end needs
        obj['type'] = 'results'
        
        obj['player'] = self.result_blob['player']
        obj['player1'] = self.result_blob['plyr1']
        obj['player2'] = self.result_blob['plyr2']
        obj['card_discarded'] = self.result_blob['card_discarded'] 
        
        obj['statusMsg'] = self.msg_status(plyr_uid)
        obj['resultMsg'] = ''
        
        obj['card1'] = None
        obj['card2'] = None
        #We show these cards only in some cases
        
        #When there's a reveal card             --Cardinal, Priest, Baroness  *Only current player sees
        #When there has to be a compare         --Baron, Dowager Queen        *Current player and plyr1 see both, losing card shown to everyone
        #When a guess is made and it's correct  --Guard, Bishop               *Everyone sees the card    
        
        #Other cases                            
        #           --Prince                      *Everyone sees discarded card
        #           --Guard on Assassin           *Everyone sees this card
        
        if obj['card_discarded'] in ['Cardinal', 'Priest', 'Baroness'] and plyr_uid == obj['player']:
            obj['card1'] = self.result_blob['card1']
            obj['card2'] = self.result_blob['card2']
            
        elif obj['card_discarded'] in ['Baron', 'Dowager Queen']:
            obj['card1'] = self.result_blob['card2'] #Losing card to everyone
            
            if plyr_uid == obj['player'] or plyr_uid == obj['player1']: #Priveleged players 
                obj['card2'] = self.result_blob['card1']
        
        elif obj['card_discarded'] in ['Guard', 'Bishop']:
            if plyr_uid == obj['player']:
                obj['resultMsg'] = 'You'
            else:
                obj['resultMsg'] = self.players[obj['player']].username
                
            
            if self.result_blob['result'] == 'Correct':
                obj['card1'] = self.result_blob['card1']
                obj['resultMsg'] += ' guessed Correctly. '
            elif self.result_blob['result'] == 'Incorrect':
                obj['resultMsg'] += ' guessed Incorrectly.'
            elif self.result_blob['result'] == 'Assassin':
                obj['card1'] = 'Assassin'
            
        elif obj['card_discarded'] == 'Prince':
            obj['card1'] = self.result_blob['card1']
            
        if self.result_blob['result'] == 'x':
            obj['resultMsg'] = 'Card discarded without effect'
        
        obj['eliminated'] = self.result_blob['eliminated']
        
        if obj['eliminated']:
            if plyr_uid == obj['eliminated'][0]:
                obj['resultMsg'] += 'You have'
            else:
                obj['resultMsg'] += self.players[obj['eliminated'][0]].username + ' has'
            obj['resultMsg'] += ' been eliminated.'
        
        
        obj['bishopGuess'] = obj['card_discarded'] == 'Bishop' and self.result_blob['result'] == 'Correct' and plyr_uid == obj['player1']

        
        obj['tokens'] = {}
        for plyr in self.players:
            obj['tokens'][plyr] = self.players[plyr].tokens
            
        
        obj['roundWinner'] = self.result_blob['roundWinner']
        if 'finalCards' in self.result_blob:
            obj['finalCards'] = self.result_blob['finalCards']

        obj['gameWinner'] = self.result_blob['gameWinner']
        
        obj['discard_pile'] = self.discard_pile
        
        return obj
    
    def msg_status(self, plyr_uid):
        if self.discard_pile:#it's not first turn
            if self.result_blob['player'] == plyr_uid:
                prevPlayer = 'You'
            else:
                prevPlayer = self.players[self.result_blob['player']].username
            
            obj = prevPlayer + ' played ' + self.result_blob['card_discarded']
            
                
            if self.result_blob['plyr1'] != None:
                obj = obj + ' on '
                if self.result_blob['plyr1'] == plyr_uid:
                    obj = obj + 'You'
                else:
                    obj = obj + self.players[self.result_blob['plyr1']].username
            
            if self.result_blob['plyr2'] != None:
                obj = obj + ' and '
                if self.result_blob['plyr2'] == plyr_uid:
                    obj = obj + 'You'
                else:
                    obj = obj + self.players[self.result_blob['plyr2']].username
        
            if self.result_blob['number'] != None:
                obj = obj + ' and guessed ' + str(self.result_blob['number'])
            
            if 'bishopGuess' in self.result_blob and self.result_blob['bishopGuess'] == 'discard':
                obj = objj + '. Card was discarded'
            return obj
        else:
            return None
            
            
    def curr_stat(self):
        # for card in self.cards:
        #     print(card.card_name)
        print(self.cards[-1].card_name, self.cards[-2].card_name, self.cards[-3].card_name )
        for plyrs in self.order:
            print(self.players[plyrs].username + '(' + self.players[plyrs].user + ')' ':' + self.players[plyrs].card.card_name + ' '*(14 - len(self.players[plyrs].card.card_name)) + '\t' +str(self.players[plyrs].card.card_number) + '\t' + str(self.players[plyrs].tokens))
        print(self.players[self.turn].username + ' has ' + self.players[self.turn].extra.card_name + ' and ' + self.players[self.turn].card.card_name + ' to play')
        #print(self.result_blob)
        #print(self.turn_status(self.turn))
        
        

        


class Game:
    def __init__(self, host, password, room_name, gid):
        self.host = host
        self.room_name = room_name
        self.password = password
        
        self.gid = gid
        
        self.state = 0 #Not started

        self.win_tokens = 4
        
        self.players = {}

        
        self.roundOver = True
        
        self.order = []
        self.round = None
        
        self.overall_winner = None
        self.all_in = {}
        
    def add_player(self, user, username):
        if self.state != 0:
            
            #Add as spectator?
            raise APIException('Can\'t add already started')
            
            
        if not user in self.players:  
            user.set_username(username)
            self.players[user.user] = user
            self.order.append(user.user)
            self.all_in[user.user] = False

        else:
            raise APIException("player already exists")
            
    def start_game(self, win = 4,extraCardsWanted = False):
        if self.state != 0:
            raise APIException("Already started")
        
        self.state = 1
        self.win_tokens = win

        random.shuffle(self.order)
        
        self.cards = allCards
        if len(self.order) > 4 or extraCardsWanted:
            self.cards += extCards
            
        ################## --------------------- COMMENT --------------------- ##################
        #for plyr in self.order:
        #    print(self.players[plyr].username)
        
        self.prev_winner_no = random.randint(0, len(self.order)-1)
        
        
        #self.round = Round(self, self.players, copy.deepcopy(self.order), copy.deepcopy(self.cards), random.randint(0, len(self.order)-1))
        #Will be started with new_round() somehow
        
    def check_winner(self):
        winnerList = []
        for plyr in self.order:
            if self.players[plyr].tokens >= self.win_tokens:
                winnerList.append(plyr)

        if len(winnerList) == 1: #Only one winner yay
            self.roundOver = True
            self.round.result_blob['gameWinner'] = winnerList[0]
            self.overall_winner = winnerList[0]
            self.state = 0
            return True
        
        elif len(winnerList) > 1: #multiple winners, start a new round with only ths people
            self.order = winnerList
            self.new_round() #Start a new round with only tied players
        else:
            return False
        
    
    def new_round(self):
        if self.state == 0:
            raise APIException("Game is not in progress yet")
        self.roundOver = False
        del self.round
        self.round = Round(self, self.players, copy.deepcopy(self.order), copy.deepcopy(self.cards), self.prev_winner_no)
        
    
#For testing
if __name__ == '__main__':
    game = Game('moi', 'name', 'pass', 0)
    game.add_player(Player('qwe'), 'a')
    game.add_player(Player('asd'), 'b')
    game.add_player(Player('zxc'), 'c')
    game.add_player(Player('rty'), 'd')
    game.add_player(Player('fgh'), 'e')

    def resandturn():
        for plyr in game.players:
            game.round.result_status(plyr)
         
        for plyr in game.players:
            game.round.turn_status(plyr)
            

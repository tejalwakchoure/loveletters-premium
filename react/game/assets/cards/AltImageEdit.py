from PIL import Image, ImageFont, ImageDraw, ImageOps

import os

class Card:
    def __init__(self, card_number, card_name, card_desc, color = (0,0,0)):
        self.card_number = card_number
        self.card_name = card_name
        self.card_desc = card_desc
        
        self.color = color


allCards = [Card(8, 'Princess', 'Lose if discarded',(245, 61, 61,255)), #"#FF0D86"),
            Card(7, 'Countess', 'Discard if caught with King or Prince', (246, 61, 199,255)),
            Card(6, 'King', 'Trade hands', (152, 61, 244,255)),
            Card(5, 'Prince', 'One player discards hand', (61, 107, 245,255)),#'#0000A0'),
            Card(4, 'Handmaid', 'Protection until next turn', (61, 245, 245,255)),
            Card(3, 'Baron', 'Compare hands, lower is out', (60, 245, 107,255)),
            Card(2, 'Priest', 'Look at a hand', (154, 245, 62,255)),
            Card(1, 'Guard', 'Guess number in hand, if correct, they\'re out', (245,199,61,255))
            ]

font = ImageFont.truetype('KaiserzeitGotisch.ttf', size=400)
new_ht = 600
new_alp = 150

def alpha_to_color(image, color=(255, 255, 255)):

    image.load()  # needed for split()
    background = Image.new('RGB', image.size, color)
    background.paste(image, mask=image.split()[3])  # 3 is the alpha channel
    background.putalpha(new_alp)
    return background

for card in allCards:

    print(card.card_name)


    #Put background
    mini = Image.open('miniBlank.png').convert('RGBA')
    mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

    #Add text
    txt = Image.new('RGBA', mini.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)   
    d.text((0, -100), str(card.card_number) + card.card_name, fill=(0,0,0, new_alp), font=font)
    mini = Image.alpha_composite(mini, txt)  

    #Add Image
    char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
    char_img = char_img.crop((460, 0, 920, 650))
    char_img = char_img.resize([int(char_img.size[0]*new_ht/650) ,new_ht])
    character = Image.new('RGBA', mini.size, (255,255,255,0))
    character.paste(alpha_to_color(char_img), (0, mini.size[1] - char_img.size[1] - 2), mask = char_img)

    #Final Image
    final = Image.alpha_composite(mini, character)
    final.save('alt' + card.card_name + '.png')
    
#FOR GUARD ------------------------------------------------------------
card = allCards[7]
#Put background
mini = Image.open('miniBlank.png').convert('RGBA')
mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

#Add text
txt = Image.new('RGBA', mini.size, (255,255,255,0))
d = ImageDraw.Draw(txt)   
d.text((400, -150), str(card.card_number), fill=(0,0,0, new_alp), font=font)
mini = Image.alpha_composite(mini, txt)  

#Add Image
char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
char_img = char_img.crop((460, 0, 920, 650))
char_img = char_img.resize([int(char_img.size[0]*new_ht/650) ,new_ht])
character = Image.new('RGBA', mini.size, (255,255,255,0))
character.paste(alpha_to_color(char_img), (0, mini.size[1] - char_img.size[1] - 2), mask = char_img)

#Final Image
final = Image.alpha_composite(mini, character)
final.save('alt' + card.card_name + '.png')

#FOR PRIEST ------------------------------------------------------------
card = allCards[6]
#Put background
mini = Image.open('miniBlank.png').convert('RGBA')
mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

#Add text
txt = Image.new('RGBA', mini.size, (255,255,255,0))
d = ImageDraw.Draw(txt)   
d.text((350, -150), str(card.card_number), fill=(0,0,0, new_alp), font=font)
mini = Image.alpha_composite(mini, txt)  

#Add Image
char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
char_img = char_img.crop((460, 0, 920, 650))
char_img = char_img.resize([int(char_img.size[0]*new_ht/650) ,new_ht])
character = Image.new('RGBA', mini.size, (255,255,255,0))
character.paste(alpha_to_color(char_img), (0, mini.size[1] - char_img.size[1] - 2), mask = char_img)

#Final Image
final = Image.alpha_composite(mini, character)
final.save('alt' + card.card_name + '.png')



extCards = [
            Card(9, 'Bishop', 'Guess number in hand, if correct, gain affection', (29, 133, 0,255)),
            Card(7, 'Dowager Queen', 'Compare hands, higher is out', (189, 0, 252, 255)),
            Card(6, 'Constable' , 'Gain 1 affection if knocked out when in discard', (245, 158, 66, 255)),
            Card(5, 'Count', 'If discarded, tallies 1 point to remaining card at end', (0, 81, 255, 255)),
            Card(4, 'Sycophant', 'Choose a player, next played card will have to target that player if it requires them to choose a player',(125, 61, 15, 255)),
            Card(3, 'Baroness', 'Choose 2 or 1 hands to look at', (30, 112, 100,255)),
            Card(2, 'Cardinal', 'Choose 2 players, they must trade hands, view one of these hands', (91, 189, 31, 255)),
            Card(0, 'Assassin', 'If other player uses guard on you, they\'re out', (0,0,0, 255) ),
            Card(0, 'Jester', 'Choose a player, if that player wins, you gain affection', (255,0,0, 255))
            ]
 
for card in extCards:
    
    print(card.card_name)
    
    
    new_ht = 650
    if card.card_name in ['Constable', 'Assassin', 'Bishop']:
        continue
    if card.card_name == "Jester":
        new_ht = 600
    #Put background
    
    mini = Image.open('miniBlank.png').convert('RGBA')
    mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

    #Add text
    txt = Image.new('RGBA', mini.size, (255,255,255,0))
    d = ImageDraw.Draw(txt)   
    d.text((350, -150), str(card.card_number), fill=(0,0,0, new_alp), font=font)
    mini = Image.alpha_composite(mini, txt)  

    #Add Image
    char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
    char_img = char_img.resize([int(char_img.size[0]*new_ht/char_img.size[1]) ,new_ht])
    character = Image.new('RGBA', mini.size, (255,255,255,0))
    character.paste(alpha_to_color(char_img), (8, mini.size[1] - char_img.size[1] - 2), mask = char_img)

    #Final Image
    final = Image.alpha_composite(mini, character)
    final.save('alt' + card.card_name + '.png')


#FOR BISHOP ------------------------------------------------------------
card = extCards[0]
new_ht = 650
#Put background
mini = Image.open('miniBlank.png').convert('RGBA')
mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

#Add text
txt = Image.new('RGBA', mini.size, (255,255,255,0))
d = ImageDraw.Draw(txt)   
d.text((300, -150), str(card.card_number), fill=(0,0,0, new_alp), font=font)
mini = Image.alpha_composite(mini, txt)  

#Add Image
char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
char_img = char_img.resize([int(char_img.size[0]*new_ht/650) ,new_ht])
character = Image.new('RGBA', mini.size, (255,255,255,0))
character.paste(alpha_to_color(char_img), (10, mini.size[1] - char_img.size[1] - 10), mask = char_img)

#Final Image
final = Image.alpha_composite(mini, character)
final.save('alt' + card.card_name + '.png')

#FOR CONSTABLE ------------------------------------------------------------
card = extCards[2]
new_ht = 650
#Put background
mini = Image.open('miniBlank.png').convert('RGBA')
mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

#Add text
txt = Image.new('RGBA', mini.size, (255,255,255,0))
d = ImageDraw.Draw(txt)   
d.text((325, -150), str(card.card_number), fill=(0,0,0, new_alp), font=font)
mini = Image.alpha_composite(mini, txt)  

#Add Image
char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
char_img = char_img.resize([int(char_img.size[0]*new_ht/650) ,new_ht])
character = Image.new('RGBA', mini.size, (255,255,255,0))
character.paste(alpha_to_color(char_img), (30, mini.size[1] - char_img.size[1] - 10), mask = char_img)

#Final Image
final = Image.alpha_composite(mini, character)
final.save('alt' + card.card_name + '.png')

#FOR ASSASSIN ------------------------------------------------------------
card = extCards[7]
new_alp = 240
new_ht = 600
#Put background(Black background)
mini = Image.open('miniBlank.png').convert('RGBA')
mini.paste(card.color, (0, 0, mini.size[0], mini.size[1]))

#Add text(white text)
txt = Image.new('RGBA', mini.size, (255,255,255,0))
d = ImageDraw.Draw(txt)   
d.text((350, -150), str(card.card_number), fill=(255,255,255, new_alp), font=font)
mini = Image.alpha_composite(mini, txt)  

#Add Image
char_img = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')

r,g,b,a = char_img.split()
rgb_image = Image.merge('RGB', (r,g,b))
inverted_image = ImageOps.invert(rgb_image)
r2,g2,b2 = inverted_image.split()
char_img = Image.merge('RGBA', (r2,g2,b2,a))

char_img = char_img.resize([int(char_img.size[0]*new_ht/char_img.size[1]) ,new_ht])
character = Image.new('RGBA', mini.size, (255,255,255,0))
character.paste(alpha_to_color(char_img), (0, mini.size[1] - char_img.size[1] - 2), mask = char_img)

#Final Image
final = Image.alpha_composite(mini, character)
final.save('alt' + card.card_name + '.png')

    



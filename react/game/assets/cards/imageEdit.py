from PIL import Image, ImageFont, ImageDraw
import os

class Card:
    def __init__(self, card_number, card_name, card_desc, color = (0,0,0)):
        self.card_number = card_number
        self.card_name = card_name
        self.card_desc = card_desc
        
        self.color = color


allCards = [Card(8, 'Princess', '',(245, 61, 61)), #"#FF0D86"),
            Card(7, 'Countess', '', (246, 61, 199)),
            Card(6, 'King', '', (152, 61, 244)),
            Card(5, 'Prince', '', (61, 107, 245)),#'#0000A0'),
            Card(4, 'Handmaid', '', (61, 245, 245)),
            Card(3, 'Baron', '', (60, 245, 107)),
            Card(2, 'Priest', '', (154, 245, 62)),
            Card(1, 'Guard', '', (245,199,61))
            ]

extCards = [
            Card(9, 'Bishop', ''),
            Card(7, 'Dowager Queen', ''),
            Card(6, 'Constable' , ''),
            Card(5, 'Count', ''),
            Card(4, 'Sycophant', ''),
            Card(3, 'Baroness', ''),
            Card(2, 'Cardinal', ''),
            Card(0, 'Assassin', ''),
            Card(0, 'Jester', '')
            ]
     
for card in allCards:
#card = allCards[0]
    mini = Image.open('mini' + card.card_name + '.png')
    ori = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
    ori = ori.crop((460, 0, 920, 650))
    new_ht = 550
    ori = ori.resize([int(ori.size[0]*new_ht/650) ,new_ht])
    ori = ori.convert('RGBA')
    
    
    
    back_im = mini.copy()
    back_im.paste(card.color, (0, 0, mini.size[0], mini.size[1]))
    back_im.paste(ori, (0, mini.size[1] - ori.size[1] - 2), mask = ori)

    draw = ImageDraw.Draw(back_im)

    font = ImageFont.truetype('KingsCross.ttf', size=300)
    font = ImageFont.truetype('KaiserzeitGotisch.ttf', size=600)

    draw.text((300, -150), str(card.card_number), fill=(0,0,0), font=font)

    back_im.save('mini' + card.card_name + '.png')
    
#FOR GUARD
card = allCards[7]
mini = Image.open('mini' + card.card_name + '.png')
ori = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
ori = ori.crop((460, 0, 920, 650))
new_ht = 550
ori = ori.resize([int(ori.size[0]*new_ht/650) ,new_ht])
ori = ori.convert('RGBA')



back_im = mini.copy()
back_im.paste(card.color, (0, 0, mini.size[0], mini.size[1]))
back_im.paste(ori, (0, mini.size[1] - ori.size[1] - 2), mask = ori)

draw = ImageDraw.Draw(back_im)

#font = ImageFont.truetype('KingsCross.ttf', size=300)
font = ImageFont.truetype('KaiserzeitGotisch.ttf', size=600)

draw.text((400, -150), str(card.card_number), fill=(0,0,0), font=font)

back_im.save('mini' + card.card_name + '.png')

#FOR PRIEST
card = allCards[6]
mini = Image.open('mini' + card.card_name + '.png')
ori = Image.open(str(card.card_number) + '-' + card.card_name.lower() + '.png')
ori = ori.crop((460, 0, 920, 650))
new_ht = 550
ori = ori.resize([int(ori.size[0]*new_ht/650) ,new_ht])
ori = ori.convert('RGBA')



back_im = mini.copy()
back_im.paste(card.color, (0, 0, mini.size[0], mini.size[1]))
back_im.paste(ori, (0, mini.size[1] - ori.size[1] - 2), mask = ori)

draw = ImageDraw.Draw(back_im)

#font = ImageFont.truetype('KingsCross.ttf', size=300)
font = ImageFont.truetype('KaiserzeitGotisch.ttf', size=600)

draw.text((350, -150), str(card.card_number), fill=(0,0,0), font=font)

back_im.save('mini' + card.card_name + '.png')
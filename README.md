###Link to website:### 

https://2playerchess.netlify.app/

###Cross-browser compatibility:###

Works on latest Chrome (87), Firefox (84) & Safari (13) specificially tested on iPhoneX, 13-inch Macbook & the iPadPro.

###Known imperfections:###

Infrastructure
	* Bad internet connection, in the middle of a move, likely causes the db to be partially modified. This can result in a player having two turns. [Database transactions have been suggested as a remedy to this](https://stackoverflow.com/questions/65236412/what-happens-to-executing-js-when-user-closes-window-or-nav-away-from-it). 
Logic
	* Castling ommited.
Styling
	* Not completely responsive. i) Making the window wide & short causes overflow. ii) Making the window incredibly short causes overflow. 



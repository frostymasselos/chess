# README 
[Link to website](https://2playerchess.netlify.app/).  

## Cross-browser compatibility
Works on latest Chrome (87), Firefox (84) & Safari (13) specificially tested on iPhoneX, 13-inch Macbook & the iPadPro.

## Known imperfections
::Infrastructure::
    * Sometimes, the db is partially modified. This always occurs when the loading bar of the website is stalled or unable to load. Usually, other sites also fail to load. This leads me to think poor internet connection is responsible for this. [In which case, database transactions may be a remedy to this](https://stackoverflow.com/questions/65236412/what-happens-to-executing-js-when-user-closes-window-or-nav-away-from-it).
    
::Styling::
    * Was made on a 13-inch Macbook. Not completely responsive. i) Making the window wide & short causes the match buttons to overflow. ii) Making the window incredibly short causes overflow.

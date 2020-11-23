function NewGame(params) {

    function navigateToMatch(params) {
        function generateCode(params) {
            return 12345;
        }
        function createDb(params) {
            
        }
        function updateFbUser(params) {
            
        }
        // console.log(5);
        window.location = `/${generateCode()}`
    }
    

    return (
        <button onClick={navigateToMatch}>Start new game</button>
    )
}

export default NewGame;


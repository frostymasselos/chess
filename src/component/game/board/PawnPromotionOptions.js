export default function pawnPromotion({pawnPromotionGraveyard, setCanPawnPromote}) {

    function exit(e) {
        setCanPawnPromote(false);
    }

    function choosePiece(e) {
        
    }
    
    function options() {
        //filter out duplicates
        const optionTags = [];
        const pawnPromotionGraveyardFilteredOutDuplicateNames = [];
        for (const deadPiece of pawnPromotionGraveyard) {
            if (pawnPromotionGraveyardFilteredOutDuplicateNames.some((filteredDeadPiece) => deadPiece.name.replace(/\d/, '') === filteredDeadPiece.name.replace(/\d/, ''))) {
                continue;
            }
            pawnPromotionGraveyardFilteredOutDuplicateNames.push(deadPiece);
        }
        //each item of filtered made into GI, 2x2.
        for (const piece of pawnPromotionGraveyardFilteredOutDuplicateNames) {
            const tag = <div onClick={choosePiece} info={piece} key={Math.random()}>{piece.name.replace(/\d/, '')}</div>;
            optionTags.push(tag);
        }
        return optionTags;
    }

    return (
        <>
            <div className='pawn-promotion-grid-container'>
                {options()}
                <a onClick={exit}>Exit</a>
            </div>
        </>
    )
}
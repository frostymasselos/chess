export default function pawnPromotion({pawnPromotionGraveyard, updatePieceToPromotePawnTo, resolvePawnPromotion}) {

    function choosePiece(e) {
        updatePieceToPromotePawnTo(e.target.dataset.name);
        resolvePawnPromotion();
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
        console.log(pawnPromotionGraveyardFilteredOutDuplicateNames);
        //each item of filtered made into GI, 2x2.
        for (const piece of pawnPromotionGraveyardFilteredOutDuplicateNames) { 
            const tag = <div onClick={choosePiece} data-name={piece.name} key={Math.random()}>{piece.name.replace(/\d/, '')}</div>;
            optionTags.push(tag);
        }
        return optionTags;
    }

    return (
        <>
            <div className='pawn-promotion-grid-container'>
                {options()}
                <a onClick={resolvePawnPromotion}>Exit</a>
            </div>
        </>
    )
}
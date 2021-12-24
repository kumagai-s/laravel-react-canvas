import { useNavigate } from "react-router-dom";

function Top() {
    let navigate = useNavigate();

    function handleClick(e) {
        let isProcessing = false;
        if (isProcessing) return false;

        isProcessing = true;
        axios.post('/api/rooms/create').then(res => {
            navigate('/rooms/' + res.data.id);
            isProcessing = false;
        });
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div>
                <button type="button" className="btn btn-outline-dark btn-lg" onClick={handleClick}>
                    ルームを作成
                </button>
            </div>
        </div>
    );
}

export default Top;


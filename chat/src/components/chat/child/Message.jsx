import "./message.css";
import moment from "moment";


export default function Message({ message, own }) {
   const value = message.time
    function formatDate() {
       const t =  moment.unix(value).fromNow()
        return t
    }

    return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">{formatDate()}</div>
    </div>
  );
}

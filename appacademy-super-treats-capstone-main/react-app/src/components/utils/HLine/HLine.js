import "./HLine.css";

export default function HLine({ text, width }) {
  return (
    <div className="hline flex-c flex-11">
      <div
        className="hline__bg"
        style={{ width: `${width}` }}
      ></div>
      <p className="hline__text">{text}</p>
    </div>
  );
}

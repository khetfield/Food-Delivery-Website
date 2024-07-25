import "./FilterIcon.css";

export default function FilterIcon({ text, src }) {
  return (
    <div className="filter-icon flex-c">
      <img
        src={src}
        alt=""
      />
      <p>{text}</p>
    </div>
  );
}

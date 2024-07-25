import "./CategorySidebar.css";

export default function CategorySidebar({ categories }) {
  const getScrollFunction = (id) => {
    return () => {
      document.getElementById(id).scrollIntoView();
    };
  };

  return (
    <div className="category-sidebar flex flex-c g10">
      {categories.map((c) => (
        <p
          key={c.id}
          className="category-sidebar__link"
          onClick={getScrollFunction(`category-${c.id}`)}
        >
          {c.name}
        </p>
      ))}
    </div>
  );
}

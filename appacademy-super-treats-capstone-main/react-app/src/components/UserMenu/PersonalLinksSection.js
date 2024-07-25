export default function UserMenu() {
  return (
    <section className="menu-section">
      <a
        href="https://somorovd.github.io/"
        className="user-menu__link personal"
        target="blank"
      >
        <i className="fa-regular fa-face-smile"></i>
        My Portfolio
      </a>
      <a
        href="https://github.com/Somorovd/appacademy-super-treats-capstone"
        className="user-menu__link personal"
        target="blank"
      >
        <i className="fa-solid fa-code"></i>
        SuperTreats Source Code
      </a>
      <a
        href="https://github.com/Somorovd"
        className="user-menu__link personal"
        target="blank"
      >
        <i className="fa-brands fa-github"></i>
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/daniel-somorov-05705313b/"
        className="user-menu__link personal"
        target="blank"
      >
        <i className="fa-brands fa-linkedin"></i>
        LinkedIn
      </a>
      <a
        href="https://wellfound.com/u/daniel-somorov"
        className="user-menu__link personal"
        target="blank"
      >
        <i className="fa-brands fa-angellist"></i>
        Wellfound
      </a>
    </section>
  );
}

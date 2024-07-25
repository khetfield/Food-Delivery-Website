import "./SubmitOrderModal.css";

export default function SubmitOrderModal() {
  return (
    <div className="submit-order-modal flex flex-c g20">
      <h2> Order Placed </h2>
      <h3>Thank you for your order!</h3>
      <p>
        More order related features will be coming in the future! In the
        meantime, you can check out my{" "}
        <a
          href="https://somorovd.github.io/"
          target="blank"
        >
          porfolio here
        </a>
        .
      </p>
    </div>
  );
}

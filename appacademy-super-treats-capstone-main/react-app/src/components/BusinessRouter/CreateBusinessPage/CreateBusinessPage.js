import PageHeader from "../../PageHeader";
import ProtectedRoute from "../../auth/ProtectedRoute";
import CreateBusinessForm from "./CreateBusinessForm";
import "./CreateBusinessPage.css";

export default function CreateBusinessPage() {
  return (
    <ProtectedRoute>
      <div className="create-business-page flex-c fh">
        <PageHeader
          backgroundColor={"black"}
          color={"white"}
          highlight={"green"}
        />
        <div className="create-business-content fh">
          <div className="create-business-content__tagline flex flex-11">
            <div>
              <h1>Unlock a new revenue stream</h1>
              <p>
                Connect with more customers and grow your business on your
                terms. Partner with us today.
              </p>
            </div>
          </div>
          <CreateBusinessForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}

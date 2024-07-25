import "./ItemManagementPage.css";
import "../TableStyling.css";

import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllItems } from "../../../store/items";
import ItemTableRow from "./ItemTableRow";
import Dialog from "@mui/material/Dialog";
import ItemEditForm from "../ItemEditForm";

export default function ItemManagementPage() {
  const { businessId } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogItemId, setDialogItemId] = useState(null);

  const itemsObj = useSelector(selectAllItems);
  const itemIds = Object.keys(itemsObj);

  const handleOpen = (id) => {
    setDialogItemId(id);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setDialogItemId(null);
  };

  return (
    <>
      <div className="item-management-page">
        <header>
          <div
            id="item-management-header"
            className="flex flex-b1"
          >
            <h2>Menu Items</h2>
            <div className="flex">
              <button
                to={`/business/${businessId}/menu/items/new`}
                className="bt-black bt-pd"
                onClick={() => handleOpen(null)}
              >
                <i className="fa-solid fa-plus"></i> Add Item
              </button>
            </div>
          </div>
        </header>
        <table className="business-table item-table">
          <thead>
            <tr>
              <th className="flex flex-11">Photo</th>
              <th className="flex flex-01">Category</th>
              <th className="flex flex-01">Name</th>
              <th className="flex flex-11">Price</th>
              <th className="flex flex-11">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {itemIds.map((id) => (
              <ItemTableRow
                itemId={id}
                key={id}
                handleOpen={() => handleOpen(id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
      >
        <ItemEditForm
          editItemId={dialogItemId}
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
}

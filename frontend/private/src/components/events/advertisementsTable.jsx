import React from "react";
import InputText from "../CustomInput";
import Button from "../CustomButton";
import "../../styles/AdvertisementsUploads.css";

const AdvertisementsTable = ({
  advertisements,
  deleteAd,
  updateAd,
  toggleStatus,
  loading,
  isEditable = true,
}) => {
  return (
    <div className="products-table-container">
      <div className="card-table">
        <div className="search-box">
          <InputText
            type="text"
            name="buscar"
            placeholder="Buscar anuncios"
            className="search-input-field"
          />
        </div>

        <div className={`table-header-row ${!isEditable ? "no-actions" : ""}`}>
          <span>Título</span>
          <span>Descripción</span>
          <span>Estado</span>
          <span>Imagen</span>
          {isEditable && <span>Acciones</span>}
        </div>

        <div className="table-body">
          {loading ? (
            <div>Cargando anuncios...</div>
          ) : advertisements.length === 0 ? (
            <div className="text-center pt-5">No hay anuncios para mostrar</div>
          ) : (
            advertisements.map((ad) => (
              <div
                key={ad._id}
                className={`table-item ${!isEditable ? "no-actions" : ""}`}
              >
                <span>{ad.tittle}</span>
                <span className="description-cell">
                  {ad.description}
                </span>
                <span
                  className={`${
                    ad.status === "Activo"
                      ? "status-active"
                      : ad.status === "Inactivo"
                      ? "status-inactive"
                      : "status-default"
                  }`}
                >
                  {ad.status}
                </span>
                <span>
                  {ad.image ? (
                    <img src={ad.image} alt="Anuncio" className="ad-image" />
                  ) : (
                    <div className="image-placeholder">Sin imagen</div>
                  )}
                </span>

                {isEditable && (
                  <div className="action-buttons-container">
                    <Button
                      text="Editar"
                      background="#FD0053"
                      color="white"
                      height="32px"
                      width="80px"
                      className="action-button-edit"
                      onClick={() => updateAd(ad)}
                    />
                    <Button
                      text="Eliminar"
                      border="1px solid #FD0053"
                      color="#FD0053"
                      background="white"
                      height="32px"
                      width="80px"
                      className="action-button-delete"
                      onClick={() => deleteAd(ad._id)}
                    />
                    <Button
                      text={ad.status === "Activo" ? "Desactivar" : "Activar"}
                      background={ad.status === "Activo" ? "#ffc107" : "#28a745"}
                      color="white"
                      height="32px"
                      width="90px"
                      className="action-button-status"
                      onClick={() => toggleStatus(ad._id, ad.status)}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementsTable;

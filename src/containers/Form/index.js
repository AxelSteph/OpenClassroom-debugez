import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      const formData = new FormData(evt.currentTarget);
      const nom = String(formData.get("nom") || "").trim();
      const prenom = String(formData.get("prenom") || "").trim();
      const type = formData.get("type");
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const validationErrors = [];

      if (!nom) validationErrors.push("Veuillez renseigner votre nom.");
      if (!prenom) validationErrors.push("Veuillez renseigner votre prénom.");
      if (!["Personel", "Entreprise"].includes(type)) {
        validationErrors.push("Veuillez choisir Personel ou Entreprise.");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationErrors.push("Veuillez saisir une adresse email valide.");
      }
      if (message.length < 10) {
        validationErrors.push("Le message doit contenir au moins 10 caractères.");
      }

      if (validationErrors.length > 0) {
        onError(validationErrors);
        return;
      }

      setSending(true);
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" name="nom" />
          <Field placeholder="" label="Prénom" name="prenom" />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            name="type"
          />
          <Field placeholder="" label="Email" name="email" />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            name="message"
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;

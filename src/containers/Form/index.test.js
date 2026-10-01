import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";

const chooseCategory = (category) => {
  fireEvent.click(screen.getByTestId("collapse-button-testid"));
  fireEvent.click(screen.getByText(category, { exact: true }));
};

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);
      const fields = screen.getAllByTestId("field-testid");
      fireEvent.change(fields[0], { target: { value: "Dupont" } });
      fireEvent.change(fields[1], { target: { value: "Marie" } });
      fireEvent.change(fields[2], { target: { value: "marie@example.fr" } });
      fireEvent.change(fields[3], {
        target: { value: "Bonjour, je souhaite obtenir des informations." },
      });
      chooseCategory("Personel");
      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Envoyer");
      expect(onSuccess).toHaveBeenCalled();
    });

    it("reports missing required fields", () => {
      const onError = jest.fn();
      const onSuccess = jest.fn();
      render(<Form onError={onError} onSuccess={onSuccess} />);

      fireEvent.click(screen.getByTestId("button-test-id"));

      expect(onError).toHaveBeenCalledWith([
        "Veuillez renseigner votre nom.",
        "Veuillez renseigner votre prénom.",
        "Veuillez choisir Personel ou Entreprise.",
        "Veuillez saisir une adresse email valide.",
        "Le message doit contenir au moins 10 caractères.",
      ]);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it("rejects an invalid email and a message shorter than 10 characters", () => {
      const onError = jest.fn();
      render(<Form onError={onError} />);
      const fields = screen.getAllByTestId("field-testid");
      fireEvent.change(fields[0], { target: { value: "Dupont" } });
      fireEvent.change(fields[1], { target: { value: "Marie" } });
      fireEvent.change(fields[2], { target: { value: "email-invalide" } });
      fireEvent.change(fields[3], { target: { value: "Court" } });
      chooseCategory("Entreprise");

      fireEvent.click(screen.getByTestId("button-test-id"));

      expect(onError).toHaveBeenCalledWith([
        "Veuillez saisir une adresse email valide.",
        "Le message doit contenir au moins 10 caractères.",
      ]);
    });
  });
});

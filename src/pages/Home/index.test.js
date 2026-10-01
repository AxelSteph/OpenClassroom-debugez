import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "./index";

describe("When Form is created", () => {
  it("a list of fields card is displayed", async () => {
    render(<Home />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success message is displayed", async () => {
      render(<Home />);
      const fields = screen.getAllByTestId("field-testid");
      fireEvent.change(fields[0], { target: { value: "Dupont" } });
      fireEvent.change(fields[1], { target: { value: "Marie" } });
      fireEvent.change(fields[2], { target: { value: "marie@example.fr" } });
      fireEvent.change(fields[3], {
        target: { value: "Bonjour, je souhaite obtenir des informations." },
      });
      const categorySelector = screen
        .getByText("Personel / Entreprise")
        .closest(".SelectContainer");
      fireEvent.click(within(categorySelector).getByTestId("collapse-button-testid"));
      fireEvent.click(within(categorySelector).getByText("Entreprise", { exact: true }));
      fireEvent(
        await screen.findByText("Envoyer"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      await screen.findByText("En cours");
      await screen.findByText("Message envoyé !");
      expect(
        screen.getByText(
          "Merci pour votre message nous tâcherons de vous répondre dans les plus brefs délais"
        )
      ).toBeInTheDocument();
    });

    it("displays validation errors in the confirmation modal", async () => {
      render(<Home />);
      fireEvent.click(await screen.findByText("Envoyer"));

      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Veuillez corriger les champs suivants")).toBeInTheDocument();
      expect(screen.getByText("Veuillez renseigner votre nom.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez renseigner votre prénom.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez choisir Personel ou Entreprise.")).toBeInTheDocument();
      expect(screen.getByText("Veuillez saisir une adresse email valide.")).toBeInTheDocument();
      expect(screen.getByText("Le message doit contenir au moins 10 caractères.")).toBeInTheDocument();
    });
  });

});


describe("When a page is created", () => {
  it("a list of events is displayed", () => {
    // to implement
  })
  it("a list a people is displayed", () => {
    // to implement
  })
  it("a footer is displayed", () => {
    // to implement
  })
  it("an event card, with the last event, is displayed", () => {
    // to implement
  })
});

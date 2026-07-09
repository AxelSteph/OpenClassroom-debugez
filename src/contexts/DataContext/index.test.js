import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  it("a call is executed on the events.json file", async () => {
    api.loadData = jest.fn().mockReturnValue({ result: "ok" });
    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });
  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();
      api.loadData = jest.fn().mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };
      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );
      const dataDisplayed = await screen.findByText("error on calling events");
      expect(dataDisplayed).toBeInTheDocument();
    });
  });

  it("exposes the latest event as last", async () => {
    api.loadData = jest.fn().mockResolvedValue({
      events: [
        { id: 1, title: "Older event", date: "2022-01-01T00:00:00.000Z" },
        { id: 2, title: "Latest event", date: "2024-01-01T00:00:00.000Z" },
      ],
    });

    const Component = () => {
      const { last } = useData();
      return <div>{last?.title}</div>;
    };

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );

    expect(await screen.findByText("Latest event")).toBeInTheDocument();
  });
  it("api.loadData", () => {
    window.console.error = jest.fn();
    global.fetch = jest.fn().mockResolvedValue(() =>
      Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
      })
    );
    const Component = () => {
      const { error } = useData();
      return <div>{error}</div>;
    };
    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );
  });
});

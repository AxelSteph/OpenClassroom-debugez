import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      const loadedData = await api.loadData();
      setData(loadedData);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Lance le chargement des données une seule fois.
  // Avant la modification, useEffect n'avait pas de dépendances et pouvait
  // relancer getData de manière incorrecte à chaque rendu.
  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  // Calcule le dernier événement à partir des données chargées.
  // Avant, `last` n'existait pas du tout dans le contexte, donc
  // la page d'accueil recevait undefined pour la carte du dernier événement.
  const last = data?.events?.reduce((latest, event) => {
    if (!latest) return event;
    return new Date(event.date) > new Date(latest.date) ? event : latest;
  }, null);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;

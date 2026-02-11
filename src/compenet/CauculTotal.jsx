

  export const calculateTotal = (Produits) => {
    return Produits
      .filter((p) => p.selected)
      .reduce((sum, p) => {
        const qtte = p.type === "fabriqué" ? p.qtte : 0;
        const price = p.prix || 0;
        const taxe = (price * qtte * (p.tax_rate || 0)) / 100;
        return sum + price * qtte + taxe;
      }, 0);
  };
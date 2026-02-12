export const HandleErr = (err, setErrMsg) => {
  if (err.response) {
    const { status, data } = err.response;
    
    if (status === 422 || status === 401) {
      setErrMsg({
        errors: data.errors || {},
        message: data.message || "Une erreur s'est produite"
      });
    } else if (status === 500) {
      setErrMsg({
        message: "Erreur serveur. Veuillez réessayer plus tard."
      });
    } else {
      setErrMsg({
        message: data.message || "Une erreur inattendue s'est produite"
      });
    }
  } else if (err.request) {
    setErrMsg({
      message: "Impossible de se connecter au serveur. Vérifiez votre connexion."
    });
  } else {
    setErrMsg({
      message: err.message || "Une erreur s'est produite"
    });
  }
};
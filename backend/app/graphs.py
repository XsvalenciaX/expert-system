from fastapi import Query
import matplotlib
matplotlib.use("Agg")  # sin interfaz gráfica
import matplotlib.pyplot as plt
import io, base64

def plot_membership(var, title="", value=None):
    """
    Genera la gráfica de una variable difusa y la devuelve en base64.
    Si se pasa un valor, lo marca en la gráfica.
    """
    fig, ax = plt.subplots(figsize=(6, 4))

    # Graficar todas las funciones de membresía
    for label, mf in var.terms.items():
        ax.plot(var.universe, mf.mf, label=label)

    # Marcar el valor recibido
    if value is not None:
        ax.axvline(x=value, color="red", linestyle="--")
        ax.plot(value, 0, "ro")  # puntito rojo en el eje

    ax.set_title(title or var.label)
    ax.legend()
    ax.grid(True)

    # Guardar como base64
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    plt.close(fig)

    return base64.b64encode(buf.getvalue()).decode("utf-8")



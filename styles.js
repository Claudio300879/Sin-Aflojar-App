import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // PANTALLA BIENVENIDA
  bienvenidaContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bienvenidaCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bienvenidaLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  bienvenidaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  bienvenidaSubtitulo: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  bienvenidaLabel: {
    fontSize: 13,
    color: '#cbd5e1',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bienvenidaInput: {
    width: '100%',
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 15,
  },
  boxTerminos: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textoTerminosTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  textoTerminos: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 15,
  },
  btnAceptarContinuar: {
    backgroundColor: '#ef4444',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBtnAceptar: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bienvenidaFooter: {
    marginTop: 15,
    fontSize: 11,
    color: '#64748b',
  },

  // PANTALLA PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120, // <--- Aumentado para que el último hábito nunca quede tapado
  },
  modoOscuroContainer: {
    backgroundColor: '#0f172a',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  textoUsuario: {
    fontSize: 15,
    color: '#334155',
  },
  btnRegalo: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoBtnRegalo: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  textoTema: {
    fontSize: 14,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  textoBlanco: {
    color: '#ffffff',
  },
  textoGrisClaro: {
    color: '#94a3b8',
  },
  cardFormulario: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  cardFormularioOscuro: {
    backgroundColor: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#0f172a',
  },
  inputOscuro: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    color: '#ffffff',
  },
  labelFrecuencia: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  rowSelectorFrecuencia: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 15,
  },
  btnFrecuencia: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  btnFrecuenciaOscuro: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  btnFrecuenciaActiva: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  textoBtnFrecuencia: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  textoBtnFrecuenciaActiva: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonAgregar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // CARD SECRETA / RECOMPENSA
  cardSecreta: {
    backgroundColor: '#e2e8f0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cardSecretaOscuro: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  tituloLogroDesbloqueado: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputSecreto: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 14,
  },
  boxDesbloqueada: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoFraseMotivadora: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
  },
  textoSecretoSub: {
    color: '#166534',
    fontSize: 12,
    textAlign: 'center',
  },

  rowCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtituloLista: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  textoRestaurar: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  textoRestaurarOscuro: {
    color: '#60a5fa',
  },
  rowFiltros: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 15,
  },
  btnFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  btnFiltroOscuro: {
    backgroundColor: '#334155',
  },
  btnFiltroActivo: {
    backgroundColor: '#1e293b',
  },
  btnFiltroActivoOscuro: {
    backgroundColor: '#2563eb',
  },
  textoFiltro: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  textoFiltroActivo: {
    color: '#ffffff',
  },
  textoVacio: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 20,
    fontStyle: 'italic',
  },
  cardHabito: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
  },
  cardHabitoOscuro: {
    backgroundColor: '#1e293b',
    borderLeftColor: '#3b82f6',
  },
  cardCompletada: {
    backgroundColor: '#f1f5f9',
    borderLeftColor: '#16a34a',
    opacity: 0.8,
  },
  cardCompletadaOscura: {
    backgroundColor: '#1e293b',
    borderLeftColor: '#22c55e',
    opacity: 0.7,
  },
  nombreHabito: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  textoTachado: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  frecuenciaHabito: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  contenedorAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botonAccion: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnCompletar: {
    backgroundColor: '#e2e8f0',
  },
  btnCompletarOscuro: {
    backgroundColor: '#334155',
  },
  btnDesmarcar: {
    backgroundColor: '#dcfce7',
  },
  btnDesmarcarOscuro: {
    backgroundColor: '#064e3b',
  },
  textoBtnAccion: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  botonEliminar: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoBtnEliminar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // MODAL REGALO
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalCardOscuro: {
    backgroundColor: '#1e293b',
  },
  modalEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalSubtitulo: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 15,
  },
  boxVistaPrevia: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 15,
  },
  tituloPrevia: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
  },
  subPrevia: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  btnImprimir: {
    backgroundColor: '#16a34a',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBtnImprimir: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnCerrarModal: {
    paddingVertical: 8,
  },
  textoBtnCerrar: {
    color: '#64748b',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
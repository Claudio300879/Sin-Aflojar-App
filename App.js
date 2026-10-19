import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Linking,
} from 'react-native';

// Enlace de tu Planilla de Hábitos en Google Sheets
const GOOGLE_SHEETS_URL =
  'https://docs.google.com/spreadsheets/d/1vbbRLOl5OgFH6f4xEKwvAttzoI_Qym-kD5-5xJDjmKA/edit?usp=sharing';

const HABITOS_INICIALES = [
  { id: '1', titulo: 'Beber 2 litros de agua', frecuencia: 'Diario', completado: false },
  { id: '2', titulo: 'Leer 15 páginas de un libro', frecuencia: 'Diario', completado: false },
  { id: '3', titulo: 'Ejercicio físico / Movimiento 30 min', frecuencia: 'Diario', completado: false },
  { id: '4', titulo: 'Aprender algo nuevo (15 min)', frecuencia: 'Diario', completado: false },
  { id: '5', titulo: 'Meditar o respirar consciente 10 min', frecuencia: 'Diario', completado: false },
  { id: '6', titulo: 'Desayunar sin pantallas', frecuencia: 'Diario', completado: false },
  { id: '7', titulo: 'Planificar el día siguiente', frecuencia: 'Diario', completado: false },
  { id: '8', titulo: 'Dormir lo necesario (7-8 hs)', frecuencia: 'Diario', completado: false },
  { id: '9', titulo: 'Agradecer o escribir un pensamiento positivo', frecuencia: 'Diario', completado: false },
  { id: '10', titulo: 'Estirar el cuerpo / Pausa activa', frecuencia: 'Diario', completado: false },
];

export default function App() {
  const [apodo, setApodo] = useState('');
  const [apodoIngresado, setApodoIngresado] = useState(false);

  const [habitos, setHabitos] = useState(HABITOS_INICIALES);
  const [textoInput, setTextoInput] = useState('');
  const [frecuencia, setFrecuencia] = useState('Diario');
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  // Modal para el Regalo
  const [modalRegaloVisible, setModalRegaloVisible] = useState(false);

  // Estado para el Modo Oscuro manual
  const [esModoOscuro, setEsModoOscuro] = useState(false);

  // Estado para el código secreto
  const [inputSecreto, setInputSecreto] = useState('');
  const [modoSecreto, setModoSecreto] = useState(false);

  // Cargar apodo y hábitos guardados al iniciar
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const apodoGuardado = await AsyncStorage.getItem('usuario_apodo');
      if (apodoGuardado) {
        setApodo(apodoGuardado);
        setApodoIngresado(true);
      }

      const datosGuardados = await AsyncStorage.getItem('habitos');
      if (datosGuardados !== null) {
        setHabitos(JSON.parse(datosGuardados));
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales', error);
    }
  };

  const guardarApodo = async () => {
    if (apodo.trim() === '') {
      Alert.alert('Atención', 'Por favor ingresá tu nombre o apodo para continuar');
      return;
    }
    try {
      await AsyncStorage.setItem('usuario_apodo', apodo.trim());
      setApodoIngresado(true);
    } catch (error) {
      console.error('Error al guardar el apodo', error);
    }
  };

  const guardarHabitosEnStorage = async (nuevosHabitos) => {
    try {
      await AsyncStorage.setItem('habitos', JSON.stringify(nuevosHabitos));
    } catch (error) {
      console.error('Error al guardar datos', error);
    }
  };

  // 1. Agregar nuevo hábito / meta
  const agregarItem = () => {
    if (textoInput.trim() === '') {
      Alert.alert('Error', 'Ingresá una descripción válida');
      return;
    }

    const nuevoItemObj = {
      id: Date.now().toString(),
      titulo: textoInput,
      frecuencia: frecuencia,
      completado: false,
    };

    const nuevosHabitos = [nuevoItemObj, ...habitos];
    setHabitos(nuevosHabitos);
    guardarHabitosEnStorage(nuevosHabitos);
    setTextoInput('');
  };

  // 2. Marcar como completado / pendiente
  const toggleCompletado = (id) => {
    const nuevosHabitos = habitos.map((h) => {
      if (h.id === id) {
        return { ...h, completado: !h.completado };
      }
      return h;
    });
    setHabitos(nuevosHabitos);
    guardarHabitosEnStorage(nuevosHabitos);
  };

  // 3. Quitar / Eliminar de la lista
  const eliminarItem = (id) => {
    const nuevosHabitos = habitos.filter((h) => h.id !== id);
    setHabitos(nuevosHabitos);
    guardarHabitosEnStorage(nuevosHabitos);
  };

  // 4. Reiniciar a los 10 hábitos iniciales
  const reiniciarPredeterminados = () => {
    setHabitos(HABITOS_INICIALES);
    guardarHabitosEnStorage(HABITOS_INICIALES);
  };

  // 5. Verificación del Código Secreto
  const verificarCodigoSecreto = (texto) => {
    setInputSecreto(texto);
    if (texto === '123456' || texto.toLowerCase() === 'pro') {
      setModoSecreto(true);
    } else {
      setModoSecreto(false);
    }
  };

  // 6. Abrir la plantilla de Google Sheets
  const abrirGoogleSheets = async () => {
    try {
      await Linking.openURL(GOOGLE_SHEETS_URL);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el enlace de Google Sheets');
    }
  };

  // Lógica de verificación de cumplimiento según la pestaña/filtro activo
  const obtenerEstadoCumplimientoActual = () => {
    if (filtroActivo === 'Todos') return false;

    const itemsFiltro = habitos.filter((h) => h.frecuencia === filtroActivo);
    if (itemsFiltro.length === 0) return false;

    const itemsCompletados = itemsFiltro.filter((h) => h.completado);
    return itemsCompletados.length === itemsFiltro.length;
  };

  const seCumplieronLosItemsDeLaCategoria = obtenerEstadoCumplimientoActual();

  // Mensaje de logro para el encabezado de la tarjeta secreta
  const obtenerMensajeLogro = () => {
    switch (filtroActivo) {
      case 'Diario': return `🏆 ¡Felicitaciones, ${apodo}! Cumpliste tus hábitos diarios.`;
      case 'Semanal': return `🏆 ¡Excelente, ${apodo}! Cumpliste tus metas semanales.`;
      case 'Mensual': return `🏆 ¡Impresionante, ${apodo}! Cumpliste tus metas mensuales.`;
      case 'Anual': return `🏆 ¡Meta cumplida, ${apodo}! Alcanzaste tu objetivo anual.`;
      default: return `🏆 ¡Felicitaciones, ${apodo}!`;
    }
  };

  // Frase motivadora segun la categoria
  const obtenerFraseMotivadora = () => {
    switch (filtroActivo) {
      case 'Diario':
        return `🚀 ¡${apodo}, Sin prisa pero sin pausa!`;
      case 'Semanal':
        return `✨ ¡${apodo}, allá donde va tu atención y conciencia, fluye tu energía!`;
      case 'Mensual':
        return `🏔️ ¡${apodo}, no conquistamos a la montaña, sino a nosotros mismos!`;
      case 'Anual':
        return `👑 ¡${apodo}, somos lo que hacemos repetidamente; la excelencia no es un acto, sino un hábito!`;
      default:
        return `🚀 ¡${apodo}, Sin prisa pero sin pausa!`;
    }
  };

  // Lógica de textos dinámicos según la frecuencia seleccionada en el formulario
  const obtenerEtiquetaPorFrecuencia = (freq) => {
    switch (freq) {
      case 'Diario': return 'Hábito';
      case 'Semanal': return 'Meta Semanal';
      case 'Mensual': return 'Meta Mensual';
      case 'Anual': return 'Objetivo Anual';
      default: return 'Registro';
    }
  };

  const obtenerPlaceholder = () => {
    switch (frecuencia) {
      case 'Diario': return 'Nombre del hábito (ej. Leer 15 min)';
      case 'Semanal': return 'Meta semanal (ej. Hacer 3 rutinas de gym)';
      case 'Mensual': return 'Meta mensual (ej. Ahorrar X porcentaje)';
      case 'Anual': return 'Objetivo anual (ej. Aprobar el año lectivo)';
      default: return 'Escribí aquí...';
    }
  };

  // Filtrado de la lista según el botón activo
  const habitosFiltrados = habitos.filter((h) => {
    if (filtroActivo === 'Todos') return true;
    return h.frecuencia === filtroActivo;
  });

  // -------------------------------------------------------------
  // PANTALLA 1: BIENVENIDA / INGRESO DE USUARIO
  // -------------------------------------------------------------
  if (!apodoIngresado) {
    return (
      <View style={styles.bienvenidaContainer}>
        <View style={styles.bienvenidaCard}>
          <Text style={styles.bienvenidaLogo}>🎯 Sin Aflojar</Text>

          <Text style={styles.bienvenidaTitulo}>¡Bienvenido a Sin Aflojar!</Text>
          <Text style={styles.bienvenidaSubtitulo}>
            Constancia diaria, semanal, mensual y anual
          </Text>

          <Text style={styles.bienvenidaLabel}>Ingresá tu nombre o apodo para continuar:</Text>
          <TextInput
            style={styles.bienvenidaInput}
            placeholder="Ej. Colo"
            placeholderTextColor="#94a3b8"
            value={apodo}
            onChangeText={setApodo}
          />

          <View style={styles.boxTerminos}>
            <Text style={styles.textoTerminosTitulo}>📜 Compromiso personal de disciplina</Text>
            <Text style={styles.textoTerminos}>
              Al ingresar aceptás comprometerte con el cumplimiento de tus hábitos y metas sin aflojar.
            </Text>
          </View>

          <Pressable style={styles.btnAceptarContinuar} onPress={guardarApodo}>
            <Text style={styles.textoBtnAceptar}>Aceptar y Continuar</Text>
          </Pressable>

          <Text style={styles.bienvenidaFooter}>🔒 Tu acceso es seguro y privado</Text>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------------
  // PANTALLA 2: APLICACIÓN PRINCIPAL
  // -------------------------------------------------------------
  return (
    <ScrollView style={[styles.container, esModoOscuro && styles.modoOscuroContainer]}>
      {/* BARRA SUPERIOR CON APODO, BOTÓN REGALO Y TOGGLE DE TEMA */}
      <View style={styles.topBar}>
        <Text style={[styles.textoUsuario, esModoOscuro && styles.textoBlanco]}>
          👤 Hola, <Text style={{ fontWeight: 'bold' }}>{apodo}</Text>
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* BOTÓN REGALO */}
          <Pressable style={styles.btnRegalo} onPress={() => setModalRegaloVisible(true)}>
            <Text style={styles.textoBtnRegalo}>🎁 Regalo</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.textoTema, esModoOscuro && styles.textoBlanco]}>
              {esModoOscuro ? '🌙' : '☀️'}
            </Text>
            <Switch
              value={esModoOscuro}
              onValueChange={(val) => setEsModoOscuro(val)}
              trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
              thumbColor={esModoOscuro ? '#60a5fa' : '#f1f5f9'}
            />
          </View>
        </View>
      </View>

      {/* TÍTULO */}
      <Text style={[styles.titulo, esModoOscuro && styles.textoBlanco]}>
        {modoSecreto ? '🌟 SIN AFLOJAR 🌟' : '🎯 Sin Aflojar'}
      </Text>
      <Text style={[styles.subtitulo, esModoOscuro && styles.textoGrisClaro]}>
        {modoSecreto ? '¡Sección activada!' : 'Constancia diaria, semanal, mensual y anual'}
      </Text>

      {/* FORMULARIO DE ENTRADA DINÁMICO */}
      <View style={[styles.cardFormulario, esModoOscuro && styles.cardFormularioOscuro]}>
        <TextInput
          style={[styles.input, esModoOscuro && styles.inputOscuro]}
          placeholder={obtenerPlaceholder()}
          placeholderTextColor={esModoOscuro ? '#94a3b8' : '#888'}
          value={textoInput}
          onChangeText={setTextoInput}
        />

        {/* Selección interactiva de Frecuencia */}
        <Text style={[styles.labelFrecuencia, esModoOscuro && styles.textoGrisClaro]}>
          Tipo de meta / Frecuencia:
        </Text>
        <View style={styles.rowSelectorFrecuencia}>
          {['Diario', 'Semanal', 'Mensual', 'Anual'].map((opcion) => (
            <Pressable
              key={opcion}
              style={[
                styles.btnFrecuencia,
                esModoOscuro && styles.btnFrecuenciaOscuro,
                frecuencia === opcion && styles.btnFrecuenciaActiva,
              ]}
              onPress={() => setFrecuencia(opcion)}>
              <Text
                style={[
                  styles.textoBtnFrecuencia,
                  esModoOscuro && styles.textoGrisClaro,
                  frecuencia === opcion && styles.textoBtnFrecuenciaActiva,
                ]}>
                {opcion}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Botón dinámico */}
        <Pressable style={styles.botonAgregar} onPress={agregarItem}>
          <Text style={styles.textoBotonAgregar}>
            + Agregar {obtenerEtiquetaPorFrecuencia(frecuencia)}
          </Text>
        </Pressable>
      </View>

      {/* SECCIÓN DEL CÓDIGO SECRETO (SE MUESTRA CUANDO SE CUMPLEN LOS ÍTEMS DE LA CATEGORÍA ACTIVA) */}
      {seCumplieronLosItemsDeLaCategoria && (
        <View style={[styles.cardSecreta, esModoOscuro && styles.cardSecretaOscuro]}>
          <Text style={styles.tituloLogroDesbloqueado}>{obtenerMensajeLogro()}</Text>
          <TextInput
            style={[styles.inputSecreto, esModoOscuro && styles.inputOscuro]}
            placeholder="Ingresá el código secreto (ej. 123456 o pro)"
            placeholderTextColor={esModoOscuro ? '#94a3b8' : '#999'}
            secureTextEntry={true}
            value={inputSecreto}
            onChangeText={verificarCodigoSecreto}
          />
          {modoSecreto && (
            <View style={styles.boxDesbloqueada}>
              <Text style={styles.textoFraseMotivadora}>
                {obtenerFraseMotivadora()}
              </Text>
              <Text style={styles.textoSecretoSub}>
                🔓 Código secreto validado. Modo PRO Activado.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* CABECERA Y FILTROS DE LA LISTA */}
      <View style={styles.rowCabecera}>
        <Text style={[styles.subtituloLista, esModoOscuro && styles.textoBlanco]}>
          Registros ({habitosFiltrados.length})
        </Text>
        <Pressable onPress={reiniciarPredeterminados}>
          <Text style={[styles.textoRestaurar, esModoOscuro && styles.textoRestaurarOscuro]}>
            Restaurar 10 iniciales
          </Text>
        </Pressable>
      </View>

      {/* BOTONES DE FILTRO (Todos, Diario, Semanal, Mensual, Anual) */}
      <View style={styles.rowFiltros}>
        {['Todos', 'Diario', 'Semanal', 'Mensual', 'Anual'].map((f) => (
          <Pressable
            key={f}
            style={[
              styles.btnFiltro,
              esModoOscuro && styles.btnFiltroOscuro,
              filtroActivo === f && (esModoOscuro ? styles.btnFiltroActivoOscuro : styles.btnFiltroActivo),
            ]}
            onPress={() => setFiltroActivo(f)}>
            <Text
              style={[
                styles.textoFiltro,
                esModoOscuro && styles.textoGrisClaro,
                filtroActivo === f && styles.textoFiltroActivo,
              ]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* LISTA DE HÁBITOS / METAS */}
      {habitosFiltrados.length === 0 ? (
        <Text style={[styles.textoVacio, esModoOscuro && styles.textoGrisClaro]}>
          No hay registros cargados en esta categoría.
        </Text>
      ) : (
        habitosFiltrados.map((item) => (
          <View
            key={item.id}
            style={[
              styles.cardHabito,
              esModoOscuro && styles.cardHabitoOscuro,
              item.completado && (esModoOscuro ? styles.cardCompletadaOscura : styles.cardCompletada),
            ]}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.nombreHabito,
                  esModoOscuro && styles.textoBlanco,
                  item.completado && styles.textoTachado,
                ]}>
                {item.titulo}
              </Text>
              <Text style={[styles.frecuenciaHabito, esModoOscuro && styles.textoGrisClaro]}>
                Tipo: <Text style={{ fontWeight: 'bold' }}>{obtenerEtiquetaPorFrecuencia(item.frecuencia)}</Text> ({item.frecuencia})
              </Text>
            </View>

            <View style={styles.contenedorAcciones}>
              {/* Botón Completar */}
              <Pressable
                style={[
                  styles.botonAccion,
                  item.completado
                    ? (esModoOscuro ? styles.btnDesmarcarOscuro : styles.btnDesmarcar)
                    : (esModoOscuro ? styles.btnCompletarOscuro : styles.btnCompletar),
                ]}
                onPress={() => toggleCompletado(item.id)}>
                <Text
                  style={[
                    styles.textoBtnAccion,
                    esModoOscuro && item.completado && { color: '#4ade80' },
                    esModoOscuro && !item.completado && { color: '#f1f5f9' },
                  ]}>
                  {item.completado ? '✔ Cumplido' : 'Pendiente'}
                </Text>
              </Pressable>

              {/* Botón Quitar */}
              <Pressable style={styles.botonEliminar} onPress={() => eliminarItem(item.id)}>
                <Text style={styles.textoBtnEliminar}>✕</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* REGALO (DIRECTO A GOOGLE SHEETS) */}
      <Modal
        visible={modalRegaloVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalRegaloVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, esModoOscuro && styles.modalCardOscuro]}>
            <Text style={styles.modalEmoji}>🎁</Text>
            <Text style={[styles.modalTitulo, esModoOscuro && styles.textoBlanco]}>
              Plantilla Imprimible de Hábitos
            </Text>
            <Text style={[styles.modalSubtitulo, esModoOscuro && styles.textoGrisClaro]}>
              Accedé a tu planilla profesional en Google Sheets con casillas interactivas, categorías por color y formato listo para imprimir.
            </Text>

            <View style={styles.boxVistaPrevia}>
              <Text style={styles.tituloPrevia}>🟢 PLANILLA DE HÁBITOS - GOOGLE SHEETS</Text>
              <Text style={styles.subPrevia}>Diseño completo estilo Spreadsheet</Text>
            </View>

            <Pressable style={styles.btnImprimir} onPress={abrirGoogleSheets}>
              <Text style={styles.textoBtnImprimir}>📊 Abrir Google Sheets e Imprimir</Text>
            </Pressable>

            <Pressable style={styles.btnCerrarModal} onPress={() => setModalRegaloVisible(false)}>
              <Text style={styles.textoBtnCerrar}>Volver a la App</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
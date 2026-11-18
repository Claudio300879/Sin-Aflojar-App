import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
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
import { styles } from './styles';

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
    <ScrollView 
      style={[styles.container, esModoOscuro && styles.modoOscuroContainer]}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
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
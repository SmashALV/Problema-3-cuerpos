import type { Language } from '@/contexts/language-context';

type TranslationKey = 
  | 'celestialOrbits'
  | 'visualizeThreeBody'
  | 'understandingThreeBodyProblem'
  | 'threeBodyProblemParagraph1'
  | 'threeBodyProblemParagraph2'
  | 'threeBodyProblemParagraph3'
  | 'threeBodyProblemParagraph4'
  | 'generateToStart'
  | 'configurationFormTitle'
  | 'predefinedScenario'
  | 'selectScenario'
  | 'scenarioDescriptionHint'
  | 'orbitalConfigurationDescription'
  | 'orbitalConfigurationDescriptionPlaceholder'
  | 'generateInitialConditions'
  | 'loading'
  | 'success'
  | 'newConditionsGenerated'
  | 'error'
  | 'failedToGenerateConditions'
  | 'simulationControlsTitle'
  | 'play'
  | 'pause'
  | 'reset'
  | 'simulationSpeed'
  | 'simulationSpeedInputLabel'
  | 'initialBodyParameters'
  | 'noParametersLoaded'
  | 'mass'
  | 'positionX'
  | 'positionY'
  | 'positionXY'
  | 'velocityX'
  | 'velocityY'
  | 'velocityVxVy'
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'settings'
  | 'theme'
  | 'language'
  | 'defaultScenarioName'
  | 'figureEightScenarioName'
  | 'lagrangianScenarioName'
  | 'hierarchicalScenarioName'
  | 'chaoticEjectionScenarioName'
  | 'playfulTriangleScenarioName'
  | 'binaryDistantOrbiterScenarioName'
  | 'slingshotScenarioName'
  | 'nearCollisionChaosScenarioName'
  | 'resonantChainScenarioName'
  | 'stableResonantOrbitScenarioName'
  | 'binaryPairPassingStarScenarioName'
  | 'multipleSmallBodiesLargeOneScenarioName'
  | 'threeBodyEscapeScenarioName'
  | 'oscillatingSystemScenarioName'
  | 'simulationDisclaimer'
  | 'toggleFullscreen'
  | 'closePanel'
  | 'openPanel'
  | 'bodyParameters'
  | 'applyChanges';


const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    celestialOrbits: 'Celestial Orbits',
    visualizeThreeBody: 'Visualize the three-body problem with AI-generated scenarios.',
    understandingThreeBodyProblem: 'Understanding the Three-Body Problem',
    threeBodyProblemParagraph1: "The \"three-body problem\" in physics and classical mechanics concerns the motion of three point masses under their mutual gravitational attraction, as described by Newton's law of universal gravitation.",
    threeBodyProblemParagraph2: "Unlike the two-body problem (e.g., a single planet orbiting a star), which has simple, predictable elliptical solutions, the three-body problem generally does not have a closed-form solution. This means there isn't a straightforward mathematical formula to predict the bodies' paths for all time.",
    threeBodyProblemParagraph3: "The behavior of a three-body system is often chaotic. This means that even tiny changes in the initial positions or velocities of the bodies can lead to drastically different trajectories and outcomes over time, making long-term prediction extremely difficult.",
    threeBodyProblemParagraph4: "This simulation allows you to explore some of these fascinating and complex orbital dances. Use the controls to generate different initial scenarios, often with AI assistance, and observe the intricate patterns that emerge.",
    generateToStart: 'Generate initial conditions to start the simulation.',
    configurationFormTitle: 'Configuration',
    predefinedScenario: 'Pre-defined Scenario',
    selectScenario: 'Select a scenario',
    scenarioDescriptionHint: 'Selecting a scenario will populate the description below. You can still edit it.',
    orbitalConfigurationDescription: 'Orbital Configuration Description',
    orbitalConfigurationDescriptionPlaceholder: "Describe the desired orbital configuration (e.g., 'A stable figure-eight orbit for three equal-mass bodies.')",
    generateInitialConditions: 'Generate Initial Conditions',
    loading: 'Loading...',
    success: 'Success',
    newConditionsGenerated: 'New initial conditions generated!',
    error: 'Error',
    failedToGenerateConditions: 'Failed to generate conditions. Please try a different description or try again later.',
    simulationControlsTitle: 'Simulation Controls',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    simulationSpeed: 'Simulation Speed',
    simulationSpeedInputLabel: 'Simulation speed input',
    initialBodyParameters: 'Initial Body Parameters',
    noParametersLoaded: 'No parameters loaded. Generate initial conditions.',
    mass: 'Mass',
    positionX: 'Position X',
    positionY: 'Position Y',
    positionXY: 'Position (X, Y)',
    velocityX: 'Velocity X',
    velocityY: 'Velocity Y',
    velocityVxVy: 'Velocity (Vx, Vy)',
    alpha: 'Alpha',
    beta: 'Beta',
    gamma: 'Gamma',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    defaultScenarioName: "Sun & Two Planets (Default)",
    figureEightScenarioName: "Stable Figure-Eight",
    lagrangianScenarioName: "Lagrangian Point L4/L5",
    hierarchicalScenarioName: "Hierarchical System",
    chaoticEjectionScenarioName: "Chaotic Ejection",
    playfulTriangleScenarioName: "Playful Triangle Dance",
    binaryDistantOrbiterScenarioName: "Binary with Distant Orbiter",
    slingshotScenarioName: "Slingshot Maneuver",
    nearCollisionChaosScenarioName: "Near-Collision Chaos",
    resonantChainScenarioName: "Resonant Chain (Attempt)",
    stableResonantOrbitScenarioName: "Stable Resonant Orbit (1:2)",
    binaryPairPassingStarScenarioName: "Binary Pair with Passing Star",
    multipleSmallBodiesLargeOneScenarioName: "Multiple Small Bodies around Large One",
    threeBodyEscapeScenarioName: "Three-Body Escape",
    oscillatingSystemScenarioName: "Oscillating System",
    simulationDisclaimer: 'This simulation provides a simplified model. Actual celestial mechanics are more complex.',
    toggleFullscreen: 'Toggle Fullscreen',
    closePanel: 'Close Panel',
    openPanel: 'Open Panel',
    bodyParameters: 'Body Parameters',
    applyChanges: 'Apply Changes',
  },
  es: {
    celestialOrbits: 'Órbitas Celestiales',
    visualizeThreeBody: 'Visualiza el problema de los tres cuerpos con escenarios generados por IA.',
    understandingThreeBodyProblem: 'Entendiendo el Problema de los Tres Cuerpos',
    threeBodyProblemParagraph1: "El \"problema de los tres cuerpos\" en física y mecánica clásica se refiere al movimiento de tres masas puntuales bajo su atracción gravitatoria mutua, según lo describe la ley de gravitación universal de Newton.",
    threeBodyProblemParagraph2: "A diferencia del problema de los dos cuerpos (por ejemplo, un solo planeta orbitando una estrella), que tiene soluciones elípticas simples y predecibles, el problema de los tres cuerpos generalmente no tiene una solución de forma cerrada. Esto significa que no existe una fórmula matemática sencilla para predecir las trayectorias de los cuerpos para todo el tiempo.",
    threeBodyProblemParagraph3: "El comportamiento de un sistema de tres cuerpos suele ser caótico. Esto significa que incluso pequeños cambios en las posiciones o velocidades iniciales de los cuerpos pueden llevar a trayectorias y resultados drásticamente diferentes con el tiempo, lo que dificulta enormemente la predicción a largo plazo.",
    threeBodyProblemParagraph4: "Esta simulación te permite explorar algunas de estas fascinantes y complejas danzas orbitales. Utiliza los controles para generar diferentes escenarios iniciales, a menudo con asistencia de IA, y observa los intrincados patrones que emergen.",
    generateToStart: 'Genera condiciones iniciales para iniciar la simulación.',
    configurationFormTitle: 'Configuración',
    predefinedScenario: 'Escenario Predefinido',
    selectScenario: 'Selecciona un escenario',
    scenarioDescriptionHint: 'Seleccionar un escenario completará la descripción a continuación. Aún puedes editarla.',
    orbitalConfigurationDescription: 'Descripción de la Configuración Orbital',
    orbitalConfigurationDescriptionPlaceholder: "Describe la configuración orbital deseada (ej., 'Una órbita estable en forma de ocho para tres cuerpos de igual masa.')",
    generateInitialConditions: 'Generar Condiciones Iniciales',
    loading: 'Cargando...',
    success: 'Éxito',
    newConditionsGenerated: '¡Nuevas condiciones iniciales generadas!',
    error: 'Error',
    failedToGenerateConditions: 'No se pudieron generar las condiciones. Por favor, intenta con una descripción diferente o vuelve a intentarlo más tarde.',
    simulationControlsTitle: 'Controles de Simulación',
    play: 'Reproducir',
    pause: 'Pausar',
    reset: 'Reiniciar',
    simulationSpeed: 'Velocidad de Simulación',
    simulationSpeedInputLabel: 'Entrada de velocidad de simulación',
    initialBodyParameters: 'Parámetros Iniciales del Cuerpo',
    noParametersLoaded: 'No hay parámetros cargados. Genera condiciones iniciales.',
    mass: 'Masa',
    positionX: 'Posición X',
    positionY: 'Posición Y',
    positionXY: 'Posición (X, Y)',
    velocityX: 'Velocidad X',
    velocityY: 'Velocidad Y',
    velocityVxVy: 'Velocidad (Vx, Vy)',
    alpha: 'Alfa',
    beta: 'Beta',
    gamma: 'Gamma',
    settings: 'Ajustes',
    theme: 'Tema',
    language: 'Idioma',
    defaultScenarioName: "Sol y Dos Planetas (Por Defecto)",
    figureEightScenarioName: "Figura Ocho Estable",
    lagrangianScenarioName: "Punto de Lagrange L4/L5",
    hierarchicalScenarioName: "Sistema Jerárquico",
    chaoticEjectionScenarioName: "Eyección Caótica",
    playfulTriangleScenarioName: "Danza Triangular Juguetona",
    binaryDistantOrbiterScenarioName: "Binario con Orbitador Distante",
    slingshotScenarioName: "Maniobra de Tirachinas",
    nearCollisionChaosScenarioName: "Caos por Casi Colisión",
    resonantChainScenarioName: "Cadena Resonante (Intento)",
    stableResonantOrbitScenarioName: "Órbita Resonante Estable (1:2)",
    binaryPairPassingStarScenarioName: "Par Binario con Estrella Pasante",
    multipleSmallBodiesLargeOneScenarioName: "Múltiples Cuerpos Pequeños alrededor de Uno Grande",
    threeBodyEscapeScenarioName: "Escape de Tres Cuerpos",
    oscillatingSystemScenarioName: "Sistema Oscilante",
    simulationDisclaimer: 'Esta simulación proporciona un modelo simplificado. La mecánica celeste real es más compleja.',
    toggleFullscreen: 'Alternar Pantalla Completa',
    closePanel: 'Cerrar Panel',
    openPanel: 'Abrir Panel',
    bodyParameters: 'Parámetros del Cuerpo',
    applyChanges: 'Aplicar Cambios',
  },
};

export function getTranslatedText(key: TranslationKey, lang: Language): string {
  return translations[lang]?.[key] || translations['en'][key] || key; // Fallback to English or key itself
}

// Helper to get translated scenario names
export function getTranslatedScenarioName(originalName: string, lang: Language): string {
    const scenarioKeyMap: Record<string, TranslationKey> = {
        "Sun & Two Planets (Default)": "defaultScenarioName",
        "Stable Figure-Eight": "figureEightScenarioName",
        "Lagrangian Point L4/L5": "lagrangianScenarioName",
        "Hierarchical System": "hierarchicalScenarioName",
        "Chaotic Ejection": "chaoticEjectionScenarioName",
        "Playful Triangle Dance": "playfulTriangleScenarioName",
        "Binary with Distant Orbiter": "binaryDistantOrbiterScenarioName",
        "Slingshot Maneuver": "slingshotScenarioName",
        "Near-Collision Chaos": "nearCollisionChaosScenarioName",
        "Resonant Chain (Attempt)": "resonantChainScenarioName",
        "Stable Resonant Orbit": "stableResonantOrbitScenarioName", // Note: Previous key was "Stable Resonant Orbit (1:2)"
        "Binary Pair with Passing Star": "binaryPairPassingStarScenarioName",
        "Multiple Small Bodies around a Large One": "multipleSmallBodiesLargeOneScenarioName",
        "Three-Body Escape": "threeBodyEscapeScenarioName",
        "Oscillating System": "oscillatingSystemScenarioName",
    };
    const key = scenarioKeyMap[originalName];
    return key ? getTranslatedText(key, lang) : originalName;
}

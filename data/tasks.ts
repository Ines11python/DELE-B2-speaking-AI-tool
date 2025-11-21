import { Task } from '../types';

export const TASKS: Task[] = [
  // --- EXAMEN 1 ---
  {
    id: 'e1-t1',
    examId: 'exam-1',
    examTitle: 'Examen 1: Individuo, alimentación, salud e higiene',
    title: 'Tarea 1: Problemas de Alimentación',
    description: 'Valorar ventajas e inconvenientes de propuestas para solucionar la obesidad.',
    type: 'TAREA_1',
    readingText: 'En el mundo hay un grave problema con la alimentación: según la ONU, más de 1300 millones de personas en el mundo padecen problemas de obesidad o sobrepeso, y las previsiones de la OCDE son que estos datos aumentarán un 10% hasta 2020. Además el problema es especialmente grave entre los niños de seis a doce años. Expertos en alimentación se han reunido para discutir algunas medidas que ayuden a solucionar esta situación.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Se deberían hacer campañas mundiales de prevención de la obesidad y el sobrepeso donde se expliquen los graves riesgos que tienen para la salud.',
      'Yo fomentaría el deporte y la vida activa en todas las edades: organizaría más torneos y competiciones deportivas.',
      'Habría que invertir más dinero en investigación para descubrir fármacos que regulen la sensación de apetito.',
      'Yo establecería normas en los comedores públicos, colegios, institutos, etc. Prohibiría la venta de bollería industrial.',
      'Yo dejaría las cosas como están. La gente tiene que ser feliz y no puede estar todo el día obsesionada con las calorías.',
      'Yo haría leyes que no permitieran la fabricación de productos procesados que contuvieran grasas poco saludables.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e1-t2',
    examId: 'exam-1',
    examTitle: 'Examen 1: Individuo, alimentación, salud e higiene',
    title: 'Tarea 2: Una Noticia Impactante',
    description: 'Describir una foto donde personas reciben una noticia impactante.',
    type: 'TAREA_2',
    promptText: 'Las personas que ve en la fotografía acaban de recibir una noticia impactante. Imagine qué ha podido ocurrir para que estas personas hayan reaccionado de esta manera.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Por qué piensa eso?',
      '¿Cree que existe alguna relación entre ellas? ¿Por qué?',
      'Seleccione a dos o tres personas de la fotografía e imagine cómo son, dónde viven, a qué se dedican...',
      '¿Qué cree que ha sucedido? ¿Por qué piensa eso?',
      '¿Puede explicar, a partir de los gestos, los sentimientos y las emociones que están viviendo estas personas?',
      '¿Qué cree que va a suceder después? ¿Cómo va a continuar la escena?'
    ],
    imageUrl: 'https://i.ibb.co/tPwYnq3C/image.png', // Generic emotional group
    examinerNotes: 'Preguntar si ha vivido una situación similar o cómo reaccionaría ante malas noticias.',
    prepTimeSeconds: 120,
    speakTimeSeconds: 180
  },
  {
    id: 'e1-t3',
    examId: 'exam-1',
    examTitle: 'Examen 1: Individuo, alimentación, salud e higiene',
    title: 'Tarea 3: Encuesta de Salud',
    description: 'Responder encuesta de salud y comparar con datos de España.',
    type: 'TAREA_3',
    promptText: 'Aquí tiene una encuesta sobre salud. Responda a las preguntas según su situación personal.',
    promptPoints: [],
    part1ImageUrl: 'https://i.ibb.co/JwcCFNBb/image.png', // Blank/Survey Image
    secondaryPrompt: `A continuación compare sus respuestas con los resultados obtenidos en España en la misma encuesta (Datos INE).
- ¿En qué se parecen? ¿Hay alguna diferencia importante?
- ¿Quiere destacar algún aspecto?
- ¿Cree que hay otros indicadores que debería contener la encuesta? ¿Puede explicarlo?`,
    part2ImageUrl: 'https://i.ibb.co/gZhGdG3j/image.png', // Data Chart Image
    prepTimeSeconds: 120,
    speakTimeSeconds: 180,
  },

  // --- EXAMEN 2 ---
  {
    id: 'e2-t1',
    examId: 'exam-2',
    examTitle: 'Examen 2: Trabajo, vivienda, economía e industria',
    title: 'Tarea 1: Problemas de la Vivienda',
    description: 'Valorar ventajas e inconvenientes de propuestas sobre la vivienda.',
    type: 'TAREA_1',
    readingText: 'El derecho universal a una vivienda, digna y adecuada, aparece recogido en la Declaración Universal de los Derechos Humanos en su artículo 25; sin embargo, este derecho se ve afectado en todo el mundo por numerosos factores: altos precios, problemas de financiación, desempleo, bajos salarios... Expertos en vivienda se han reunido para discutir algunas medidas que ayuden a solucionar esta situación.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Tener una vivienda digna y a un precio asequible es un derecho fundamental. Por ello, los políticos de cada país deberían aprobar leyes que ayuden a las personas sin recursos.',
      'Se debe evitar el excesivo proteccionismo de los gobiernos. Una vivienda es un bien privado y una inversión.',
      'Es preferible alquilar una casa o un piso que comprarlo. Con la crisis se ha demostrado que los precios de los pisos pueden bajar.',
      'Alquilar un piso es tirar el dinero. Con una entrada y unos plazos mensuales al final tienes un piso en propiedad.',
      'Los jóvenes tienen graves dificultades para acceder a la vivienda por su elevado precio y la falta de trabajo.',
      'Algunas soluciones al problema actual de la vivienda podrían ser: compartir piso, construir casas más pequeñas y asequibles.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e2-t2',
    examId: 'exam-2',
    examTitle: 'Examen 2: Trabajo, vivienda, economía e industria',
    title: 'Tarea 2: Una Entrevista de Trabajo',
    description: 'Describir una situación imaginaria a partir de una foto.',
    type: 'TAREA_2',
    promptText: 'Las personas que ve en la fotografía están esperando para realizar una entrevista de trabajo. Tiene que describir la escena que ve y hablar sobre ella.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Qué tipo de empleo es el que buscan? ¿Por qué piensa eso?',
      '¿Tienen algo en común? ¿Ve diferencias entre ellos en su postura, en la forma de vestir, en su actitud...?',
      'Seleccione dos o tres personas de la fotografía e imagine cómo son, dónde viven, a qué se dedican, qué están ahí...',
      '¿Qué cree que va a suceder en las entrevistas? En su opinión, ¿cuál de ellos va a obtener el empleo?'
    ],
    imageUrl: 'https://i.ibb.co/LzmkTwRm/image.png', 
    prepTimeSeconds: 120,
    speakTimeSeconds: 180
  },
  {
    id: 'e2-t3',
    examId: 'exam-2',
    examTitle: 'Examen 2: Trabajo, vivienda, economía e industria',
    title: 'Tarea 3: Encuesta sobre calidad de vida',
    description: 'Comentar encuestas y comparar datos.',
    type: 'TAREA_3',
    promptText: 'Responda a las preguntas de la encuesta personal sobre el tema. Explique el grado de importancia que tiene cada uno de ellos para usted.',
    promptPoints: [],
    part1ImageUrl: 'https://i.ibb.co/1tvqMM8W/image.png', 
    secondaryPrompt: 'A continuación compare sus respuestas con los resultados obtenidos en España en la misma encuesta. (Los aspectos más relevantes están marcados con una flecha).',
    part2ImageUrl: 'https://i.ibb.co/0VZhWm0Z/image.png', 
    prepTimeSeconds: 120,
    speakTimeSeconds: 180
  },

  // --- EXAMEN 3 ---
  {
    id: 'e3-t1',
    examId: 'exam-3',
    examTitle: 'Examen 3: Educación, ciencia y tecnología',
    title: 'Tarea 1: Problemas de Educación',
    description: 'Valorar ventajas e inconvenientes de propuestas educativas.',
    type: 'TAREA_1',
    readingText: 'En el mundo hay graves problemas relacionados con la educación: millones de niños no están escolarizados; existe una gran desigualdad educativa entre hombres y mujeres en muchos países; muchas personas no pueden acceder a una educación de calidad o fracasan en el intento... Expertos en educación se han reunido para discutir algunas medidas que permitan mejorar esta situación.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Educación gratuita y universal. Los organismos internacionales deben garantizar el acceso a la educación a todos los seres humanos.',
      'Yo soy partidario de una educación pública de calidad que permita corregir las diferencias sociales entre las personas.',
      'Los actuales métodos de enseñanza están anticuados. Hay que motivar a los estudiantes acercando a las aulas las nuevas tecnologías.',
      'La enseñanza pública es de baja calidad. Hay que fomentar la enseñanza privada para atender a los alumnos que busquen la excelencia.',
      'La universidad no es para todo el mundo. Es mejor orientar a las personas menos capacitadas hacia estudios de formación profesional.',
      'Es fundamental fomentar el bilingüismo desde la etapa preescolar. Y mejor una educación que permita aprender durante toda la vida.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e3-t2',
    examId: 'exam-3',
    examTitle: 'Examen 3: Educación, ciencia y tecnología',
    title: 'Tarea 2: Jóvenes Investigadores',
    description: 'Describir la situación en un laboratorio.',
    type: 'TAREA_2',
    promptText: 'Usted debe imaginar la situación que se está produciendo en la fotografía y, a continuación, tiene que describirla. Puede haber más de una respuesta.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Por qué piensa eso?',
      '¿Qué cree que están haciendo? ¿En qué están trabajando? ¿Por qué?',
      'Seleccione a dos o tres personas de la fotografía e imagine cómo son, qué edad tienen, cuál es su situación educativa o profesional...',
      '¿Cuál cree que será el futuro profesional de estas personas?'
    ],
    imageUrl: 'https://i.ibb.co/ZsBrF4J/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 200
  },
  {
    id: 'e3-t3',
    examId: 'exam-3',
    examTitle: 'Examen 3: Educación, ciencia y tecnología',
    title: 'Tarea 3: Equipamiento Tecnológico',
    description: 'Relacionar columnas y comparar datos.',
    type: 'TAREA_3',
    promptText: 'Aquí tiene una encuesta sobre el equipamiento de productos TIC (Tecnología de la Información y la Comunicación). Léala y responda: ¿Qué porcentaje de viviendas de su país cree que tienen los siguientes productos tecnológicos?',
    promptPoints: [],
    part1ImageUrl: 'https://i.ibb.co/bMRsRYb9/image.png', // Placeholder
    secondaryPrompt: 'A continuación compare sus respuestas con los resultados obtenidos en España en la misma encuesta.\n- ¿En qué se parecen? ¿Hay alguna diferencia importante?\n- ¿Cree que hay otros productos TIC que debería contener la encuesta?',
    part2ImageUrl: 'https://i.ibb.co/DPyrJDB5/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 240
  },

  // --- EXAMEN 4 ---
  {
    id: 'e4-t1',
    examId: 'exam-4',
    examTitle: 'Examen 4: Ocio, compras y actividades artísticas',
    title: 'Tarea 1: La Práctica del Deporte',
    description: 'Valorar propuestas sobre el deporte y sedentarismo.',
    type: 'TAREA_1',
    readingText: 'El estilo de vida actual es bastante sedentario, lo que está ocasionando serios trastornos tanto físicos como psíquicos en el conjunto de la población. Expertos en salud y deporte se han reunido para poner en común algunas medidas que ayuden a mejorar la situación.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Se deberían hacer campañas mundiales para favorecer el ejercicio físico y una vida más activa.',
      'El deporte puede provocar lesiones o accidentes cardiovasculares, sobre todo a determinadas edades.',
      'El deporte tiene múltiples ventajas: favorece el trabajo en equipo, mejora el estado de salud, ayuda a prevenir enfermedades.',
      'Yo establecería normas sobre la práctica del deporte en edades tempranas. Prohibiría las sesiones largas de entrenamiento.',
      'En mi opinión, tanto deporte no es bueno: antes no lo hacíamos y no pasaba nada. Yo ahora veo a jóvenes obsesionados con los músculos.',
      'Habría que aprobar leyes que persiguieran de verdad el dopaje y que controlaran las competiciones que exigen metas imposibles.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e4-t2',
    examId: 'exam-4',
    examTitle: 'Examen 4: Ocio, compras y actividades artísticas',
    title: 'Tarea 2: Un Acto o Espectáculo Público',
    description: 'Describir una situación en un teatro o cine.',
    type: 'TAREA_2',
    promptText: 'Las personas que ve en la fotografía están asistiendo a un acto o espectáculo. Tiene que imaginar la situación y hablar de ello durante 2 minutos aproximadamente.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Por qué piensa eso?',
      '¿Cree que existe alguna relación entre ellas? ¿Por qué?',
      'Seleccione dos o tres personas de la fotografía e imagine cómo son, dónde viven, a qué se dedican...',
      '¿Puede explicar, a partir de los gestos y actitudes de las distintas personas, qué está pasando en ese momento?',
      '¿Qué cree que va a suceder después? ¿Cómo va a continuar la escena?'
    ],
    imageUrl: 'https://i.ibb.co/Wp2yVmGv/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 200
  },
  {
    id: 'e4-t3',
    examId: 'exam-4',
    examTitle: 'Examen 4: Ocio, compras y actividades artísticas',
    title: 'Tarea 3: Encuesta sobre Actividades Culturales',
    description: 'Analizar hábitos culturales.',
    type: 'TAREA_3',
    promptText: 'Lea los resultados de la siguiente encuesta sobre hábitos y prácticas culturales. Comente qué le parecen.',
    promptPoints: [],
    part1ImageUrl: 'https://i.ibb.co/3yfNf2dk/image.png', // Placeholder
    secondaryPrompt: 'A continuación dé su opinión sobre los resultados de esta encuesta:\n- ¿Le sorprende alguno de ellos?\n- ¿Cuáles serían los resultados de esta encuesta en su país?\n- ¿Con qué frecuencia realiza las siguientes actividades culturales?',
    part2ImageUrl: 'https://i.ibb.co/NgzzJY1v/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },

  // --- EXAMEN 5 ---
  {
    id: 'e5-t1',
    examId: 'exam-5',
    examTitle: 'Examen 5: Información, medios de comunicación y sociedad',
    title: 'Tarea 1: Problemas de Internet',
    description: 'Valorar ventajas e inconvenientes de soluciones para internet.',
    type: 'TAREA_1',
    readingText: 'Internet es un medio de comunicación que ofrece innumerables ventajas en este mundo globalizado. Sin embargo, presenta también numerosos problemas e inconvenientes que, en ocasiones, derivan en lamentables consecuencias. Expertos sobre Internet se han reunido para denunciar los principales problemas y discutir algunas medidas que ayuden a remediarlos.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Se debería fomentar el acceso a Internet en los países menos desarrollados para impedir la distancia digital.',
      'Sería deseable que se ofreciera más seguridad en los pagos con tarjeta en la Red.',
      'Habría que controlar y vigilar más las redes sociales para evitar los ataques a la privacidad y el acoso.',
      'Sería conveniente establecer normas en el uso de la publicidad, que es excesiva e interfiere en los contenidos.',
      'Yo crearía leyes para preservar el derecho a la propiedad intelectual. Los contenidos culturales tienen que pagarse.',
      'Creo que habría que dejar las cosas como están. Nadie puede impedir que los usuarios compartan los contenidos en la Red.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e5-t2',
    examId: 'exam-5',
    examTitle: 'Examen 5: Información, medios de comunicación y sociedad',
    title: 'Tarea 2: Una Noticia Inesperada',
    description: 'Describir a una persona recibiendo una noticia por teléfono.',
    type: 'TAREA_2',
    promptText: 'La persona que ve en la fotografía está recibiendo o trasmitiendo una noticia por teléfono. Imagine la situación y hable sobre ello.',
    promptPoints: [
      '¿Dónde cree que se encuentra esta persona? ¿Por qué piensa eso?',
      'Imagine quién es, cómo es, dónde vive, a qué se dedica...',
      '¿Qué cree que ha sucedido? ¿Por qué?',
      '¿Puede explicar, a partir de la imagen, cómo se siente esta mujer?',
      '¿Qué cree que va a suceder a partir de esta conversación?'
    ],
    imageUrl: 'https://images.pond5.com/sad-worried-woman-talking-cellphone-footage-072028122_iconl.jpeg', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 240
  },
  {
    id: 'e5-t3',
    examId: 'exam-5',
    examTitle: 'Examen 5: Información, medios de comunicación y sociedad',
    title: 'Tarea 3: Audiencia General de Medios',
    description: 'Analizar gráfico de audiencia de medios.',
    type: 'TAREA_3',
    promptText: 'Aquí tiene los resultados de una encuesta realizada en España sobre medios de comunicación. Léala y responda a las preguntas.',
    promptPoints: [],
    part1ImageUrl: 'https://i.ibb.co/KzFhPbSR/image.png', // Placeholder
    secondaryPrompt: '- ¿Le sorprende alguno de los resultados? En caso afirmativo, ¿por qué?\n- ¿Cree que en su país los resultados serían los mismos?\n- ¿Qué ventajas e inconvenientes ve en cada uno de estos medios de comunicación?',
    part2ImageUrl: 'https://i.ibb.co/KzFhPbSR/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },

  // --- EXAMEN 6 ---
  {
    id: 'e6-t1',
    examId: 'exam-6',
    examTitle: 'Examen 6: Política, temas sociales, religión y filosofía',
    title: 'Tarea 1: Los Problemas de los Derechos Humanos',
    description: 'Valorar propuestas sobre derechos humanos.',
    type: 'TAREA_1',
    readingText: 'Desde que en la Organización de las Naciones Unidas (ONU) se aprobó la Declaración Universal de Derechos Humanos en 1948, en el mundo se han dado muchos pasos positivos en este sentido. Sin embargo, todavía queda mucho camino que recorrer para conseguir la igualdad, la justicia y la paz de toda la familia humana. Expertos en Derechos Humanos se han reunido para denunciar los principales problemas y discutir algunas medidas que ayuden a remediarlos.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Se deberían tomar medidas para asegurar el derecho a la vida, a la igualdad y a la libertad de todos los seres humanos.',
      'Es prioritario que los poderes públicos garanticen los derechos básicos de alimentación, vestido, vivienda, asistencia médica...',
      'Sería conveniente establecer leyes internacionales que persigan con firmeza la tortura, los tratos crueles y degradantes.',
      'Habría que facilitar el derecho a circular libremente, a elegir la residencia en el territorio de un Estado.',
      'Yo crearía leyes para que los gobiernos y organismos competentes garanticen el derecho al trabajo.',
      'Yo creo que habría que dejar que las cosas se solucionen por sí mismas. Todavía hay muchos países poco desarrollados.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e6-t2',
    examId: 'exam-6',
    examTitle: 'Examen 6: Política, temas sociales, religión y filosofía',
    title: 'Tarea 2: Una Protesta Ciudadana',
    description: 'Describir una manifestación en la calle.',
    type: 'TAREA_2',
    promptText: 'Las personas que aparecen en esta fotografía están asistiendo a una manifestación en la calle. Imagine la situación y hable sobre ella.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Por qué piensa eso?',
      '¿Cree que existe alguna relación entre ellas? ¿Por qué?',
      'Seleccione dos o tres personas de la fotografía e imagine cómo son, dónde viven, a qué se dedican...',
      '¿Puede explicar, a partir de los gestos y movimientos, qué está sucediendo en ese momento?',
      '¿Cómo cree que va a continuar la escena?'
    ],
    imageUrl: 'https://i.ibb.co/BScTk1V/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 240
  },
  {
    id: 'e6-t3',
    examId: 'exam-6',
    examTitle: 'Examen 6: Política, temas sociales, religión y filosofía',
    title: 'Tarea 3: Temas Sociales y Políticos',
    description: 'Relacionar imágenes con temas sociales.',
    type: 'TAREA_3',
    promptText: 'Aquí tiene algunas imágenes relacionadas con la vida social, política y religiosa. Relacione cada imagen con su realidad correspondiente.',
    promptPoints: ['¿Por qué ha elegido esas imágenes? ¿Qué le llama la atención sobre ellas?',
    '¿Puede explicar su respuesta?',
    'En su caso, icuál de estos temas representados le parece más relevante en la actua-lidad?',
    '¿Cómo ve el futuro de todas estas cuestiones?'],
    part1ImageUrl: 'https://i.ibb.co/39CQqS6r/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },

  // --- EXAMEN 7 ---
  {
    id: 'e7-t1',
    examId: 'exam-7',
    examTitle: 'Examen 7: Viajes, transportes, geografía y medio ambiente',
    title: 'Tarea 1: Los Problemas Medioambientales',
    description: 'Valorar propuestas sobre medio ambiente.',
    type: 'TAREA_1',
    readingText: 'En la última Cumbre de la Tierra celebrada en 2012 en Estocolmo y convocada por la ONU se trataron cuestiones medioambientales y se establecieron las bases de una necesaria política internacional sobre medio ambiente. Expertos en el tema se reunieron para denunciar los principales problemas y discutir algunas medidas que ayuden a remediarlos.',
    promptText: 'Usted deberá hablar durante 2 o 3 minutos de las ventajas e inconvenientes de una serie de soluciones que se proponen para un determinado problema.',
    promptPoints: [
      'Habría que preservar los ecosistemas de especial valor medioambiental para evitar la extinción de sus especies vegetales y animales.',
      'Se deberían tomar medidas para preservar el medio ambiente y para favorecer el desarrollo sostenible. Los recursos naturales son limitados.',
      'Hay que llevar a la cárcel a las personas que provocan intencionadamente incendios, deforestación, mareas negras...',
      'Sería necesario llegar a acuerdos internacionales para limitar la emisión de gases de efecto invernadero.',
      'Yo pondría multas a todas las empresas que contaminen o viertan sus residuos tóxicos y obligaría a que todas las compañías utilicen energías limpias.',
      'Yo creo que no hay que obsesionarse con el tema. En la historia del mundo siempre ha habido ciclos alternativos de calor y de frío.'
    ],
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  },
  {
    id: 'e7-t2',
    examId: 'exam-7',
    examTitle: 'Examen 7: Viajes, transportes, geografía y medio ambiente',
    title: 'Tarea 2: Viaje con Mal Tiempo',
    description: 'Describir turistas bajo la lluvia.',
    type: 'TAREA_2',
    promptText: 'Las personas que aparecen en esta fotografía se encuentran de turismo en una ciudad. Imagine la situación y hable sobre ella.',
    promptPoints: [
      '¿Dónde cree que se encuentran estas personas? ¿Por qué piensa eso?',
      '¿Cree que existe alguna relación entre ellas? ¿Por qué?',
      'Seleccione dos o tres personas de la fotografía e imagine cómo son, dónde viven, a qué se dedican...',
      '¿Puede explicar, a partir de los gestos y movimientos, qué está sucediendo en ese momento?',
      '¿Cómo cree que va a continuar la escena? ¿Qué cree que van a hacer a continuación?'
    ],
    imageUrl: 'https://i.ibb.co/yFb0hKXn/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 240
  },
  {
    id: 'e7-t3',
    examId: 'exam-7',
    examTitle: 'Examen 7: Viajes, transportes, geografía y medio ambiente',
    title: 'Tarea 3: Destinos Turísticos',
    description: 'Hablar de preferencias de viaje y datos.',
    type: 'TAREA_3',
    promptText: 'La tarea 3 consiste en conversar de manera informal a partir de un estímulo escrito o gráfico.',
    promptPoints: ['¿Qué tipo de viajes suele hacer? ¿Adónde le gusta viajar?'],
    part1ImageUrl: 'https://i.ibb.co/KcqB4r8w/image.png', // Placeholder
    secondaryPrompt: 'A continuación compare sus respuestas con los resultados obtenidos en España en una encuesta con las mismas preguntas.\n- ¿En qué se parecen? ¿Hay alguna diferencia importante?\n- ¿Cuáles son sus actividades favoritas cuando viaja?',
    part2ImageUrl: 'https://i.ibb.co/hFRFRPtt/image.png', // Placeholder
    prepTimeSeconds: 120,
    speakTimeSeconds: 300
  }
];

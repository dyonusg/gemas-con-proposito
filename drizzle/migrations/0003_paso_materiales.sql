ALTER TABLE public.lecciones ADD COLUMN dinamica_materiales TEXT;

UPDATE public.lecciones SET dinamica_materiales = 'Un espejito o papel de aluminio por niño, y plastilina para las «manchas».' WHERE numero = 1;
UPDATE public.lecciones SET dinamica_materiales = 'Una bolsa con frutas, lápices o fichas para repartir.' WHERE numero = 2;
UPDATE public.lecciones SET dinamica_materiales = 'Una flor, real o de papel.' WHERE numero = 3;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo las situaciones preparadas para representar.' WHERE numero = 4;
UPDATE public.lecciones SET dinamica_materiales = 'Una caja y tarjetas con «regalos invisibles» escritos (una sonrisa, ayudar a recoger…).' WHERE numero = 5;
UPDATE public.lecciones SET dinamica_materiales = 'Sillas: una menos que el número de niños.' WHERE numero = 6;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo espacio para moverse.' WHERE numero = 7;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo las frases y emociones preparadas.' WHERE numero = 8;
UPDATE public.lecciones SET dinamica_materiales = 'Semillas, agua y un vaso con tierra por niño.' WHERE numero = 9;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo la voz y la memoria del grupo.' WHERE numero = 10;
UPDATE public.lecciones SET dinamica_materiales = 'Una piedra por niño y una cesta.' WHERE numero = 11;
UPDATE public.lecciones SET dinamica_materiales = 'Un «monedero» con fichas para esconder en la sala.' WHERE numero = 12;
UPDATE public.lecciones SET dinamica_materiales = 'Un gran corazón de papel.' WHERE numero = 13;
UPDATE public.lecciones SET dinamica_materiales = 'Una mochila real o dibujos de objetos para el viaje.' WHERE numero = 14;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo las situaciones preparadas.' WHERE numero = 15;
UPDATE public.lecciones SET dinamica_materiales = 'Gotas de papel de colores, un gran océano dibujado y pegamento.' WHERE numero = 16;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo las escenas preparadas.' WHERE numero = 17;
UPDATE public.lecciones SET dinamica_materiales = 'Papel y colores para dibujar.' WHERE numero = 18;
UPDATE public.lecciones SET dinamica_materiales = 'Un sobre con una tarea escrita (el «mensaje»).' WHERE numero = 19;
UPDATE public.lecciones SET dinamica_materiales = 'Velas de papel, llamas de papel y pegamento.' WHERE numero = 20;
UPDATE public.lecciones SET dinamica_materiales = 'Una linterna.' WHERE numero = 21;
UPDATE public.lecciones SET dinamica_materiales = 'Sin materiales: solo un recorrido sencillo en la sala.' WHERE numero = 22;
UPDATE public.lecciones SET dinamica_materiales = 'Vasos o bloques para construir y una campana.' WHERE numero = 23;
UPDATE public.lecciones SET dinamica_materiales = 'Cartulinas para agitar como si fueran viento.' WHERE numero = 24;

ALTER TABLE public.progreso_pasos DROP CONSTRAINT progreso_pasos_paso_check;
ALTER TABLE public.progreso_pasos ADD CONSTRAINT progreso_pasos_paso_check CHECK (paso IN ('materiales','cita','virtud','cancion','historia','dinamica','manualidad','juego','media','clase'));
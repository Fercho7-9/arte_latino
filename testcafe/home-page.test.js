import { Selector } from 'testcafe';

fixture('Página principal - ARTE LATINO')
    .page('http://localhost:4200');

test('Debe mostrar el título principal "Arte Latino"', async t => {
    const titulo = Selector('h1').withText('Arte Latino');

    await t
        .wait(1000)
        .expect(titulo.exists).ok()
        .expect(titulo.innerText).contains('Arte Latino')
        .wait(3000);  // Espera final
});

test('Debe mostrar el eslogan en la columna izquierda', async t => {
    const eslogan = Selector('p').withText('Conectando artistas latinos');

    await t
        .wait(1000)
        .expect(eslogan.exists).ok()
        .expect(eslogan.innerText).contains('Conectando artistas latinos')
        .wait(3000);  // Espera final
});

test('Debe mostrar la sección "¿Quiénes somos?"', async t => {
    const quienesSomosTitulo = Selector('h2').withText('¿Quiénes somos?');
    const quienesSomosTexto = Selector('p').withText('Somos una plataforma dedicada a empoderar artistas latinos');

    await t
        .wait(1000)
        .expect(quienesSomosTitulo.exists).ok()
        .expect(quienesSomosTexto.exists).ok()
        .wait(3000);  // Espera final
});

test('Debe mostrar botón "Ver más obras" y navegar a /tienda', async t => {
    const botonVerMas = Selector('button').withText('Ver más obras');

    await t
        .wait(1000)
        .expect(botonVerMas.exists).ok()
        .scrollIntoView(botonVerMas)
        .click(botonVerMas)
        .expect(t.eval(() => location.pathname)).eql('/tienda')
        .wait(3000);  // Espera final
});

test('Debe fallar porque el texto "Bienvenido a ArteLatino 2" no existe', async t => {
    const textoFalso = Selector('h1').withText('Bienvenido a ArteLatino 2');

    await t
        .wait(1000)
        .expect(textoFalso.exists).ok() // ❌ Esto fallará
        .wait(3000);
});

// ✅ Nuevo test: Interactuar con botón "Ingresar" en el navbar e iniciar sesión
test('Debe navegar a login desde el navbar e iniciar sesión', async t => {
    const botonIngresar = Selector('a').withText('Ingresar');
    const tituloLogin = Selector('h1').withText('Bienvenido a Arte Latino');
    const campoEmail = Selector('#email');
    const campoPassword = Selector('#password');
    const botonLoginForm = Selector('button').withText('Ingresar');

    await t
        .wait(1000)
        .expect(botonIngresar.exists).ok()
        .click(botonIngresar)
        .wait(2000)
        .expect(t.eval(() => location.pathname)).eql('/login')
        .expect(tituloLogin.exists).ok()
        .typeText(campoEmail, 'usuario@correo.com', { replace: true })
        .typeText(campoPassword, 'contrasena123', { replace: true })
        .click(botonLoginForm)
        .wait(3000); // Espera final tras acción
});

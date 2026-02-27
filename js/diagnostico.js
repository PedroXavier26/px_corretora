document.addEventListener('DOMContentLoaded', function () {

    // ===============================
    // CAMPOS CONDICIONAIS (COLABORADORES)
    // ===============================
    const colaboradores = document.getElementById('colaboradores');
    const campoExato = document.getElementById('colaboradores-exato');
    const inputExato = document.getElementById('qtde_exata');

    if (colaboradores) {
        colaboradores.addEventListener('change', function () {
            if (this.value === '201_mais') {
                campoExato.classList.remove('hidden');
                inputExato.required = true;
            } else {
                campoExato.classList.add('hidden');
                inputExato.required = false;
                inputExato.value = '';
            }
        });
    }

    // ===============================
    // TOGGLE EMPRESA / FAMÍLIA
    // ===============================
    window.toggleContext = function (tipo) {
        const empresa = document.getElementById('contexto-empresa');
        const familia = document.getElementById('contexto-familia');

        empresa.classList.add('hidden');
        familia.classList.add('hidden');

        empresa.querySelectorAll('input, select').forEach(el => el.required = false);
        familia.querySelectorAll('input, select').forEach(el => el.required = false);

        if (tipo === 'empresa') {
            empresa.classList.remove('hidden');
            document.getElementById('cnpj').required = true;
            document.getElementById('colaboradores').required = true;
        }

        if (tipo === 'familia') {
            familia.classList.remove('hidden');
            document.getElementById('cidade_f').required = true;
        }
    };

    // ===============================
    // ENVIO DO FORMULÁRIO (WORKER)
    // ===============================
    const form = document.getElementById('diagnosticoForm');
    const sucesso = document.getElementById('success-message');
    const container = document.getElementById('form-container');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(
                "https://px-corretora-form.pxavier-26-07.workers.dev",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) throw new Error();

            // SUCESSO
            container.classList.add('hidden');
            sucesso.classList.remove('hidden');
            sucesso.scrollIntoView({ behavior: 'smooth' });
            form.reset();

        } catch (error) {
            alert("Erro ao enviar o formulário. Tente novamente.");
            console.error(error);
        }
    });

    // ===============================
    // MÁSCARA DE CNPJ
    // ===============================
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function () {
            this.value = this.value
                .replace(/\D/g, '')
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .slice(0, 18);
        });
    }

});

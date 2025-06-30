let monGraphique = null;

document.getElementById("btnCalcul").addEventListener("click", function() {
  // Récupérer les valeurs
  const masse = parseFloat(document.getElementById("masse").value);
  const penteDeg = parseFloat(document.getElementById("pente").value);
  const vitesse = parseFloat(document.getElementById("vitesse").value);
  const acc = parseFloat(document.getElementById("acc").value);
  const d = parseFloat(document.getElementById("diametre").value);
  const nb_moteur = parseFloat(document.getElementById("nb_moteur").value);
  const tension = parseFloat(document.getElementById("tension").value);
  const temps = parseFloat(document.getElementById("temps").value);
  const rend = parseFloat(document.getElementById("rendement").value);
  const reducteur = parseFloat(document.getElementById("reducteur").value);

  // Constantes fixes
  const sur = 0.1;
  const g = 9.81;
  const Den = 1.2;
  const Crr = 0.01;
  const C = 1;

  // Vérification des valeurs
  if (
    isNaN(masse) || isNaN(penteDeg) || isNaN(vitesse) || isNaN(acc) ||
    isNaN(d) || isNaN(nb_moteur) || isNaN(tension) || isNaN(temps) || isNaN(rend) || isNaN(reducteur)
  ) {
    alert("Veuillez remplir correctement tous les champs nécessaires.");
    return;
  }

  // Calculs intermédiaires
  const penteRad = penteDeg * Math.PI / 180;
  const rayon = d / 2;
  const v_ang = (vitesse / rayon)*reducteur;
  const Fa = masse * acc;
  const Fs = masse * g * Math.sin(penteRad);
  const Fopp = (0.5 * Den * C * sur * vitesse * vitesse) + (masse * g * Crr);
  const Fn = Fa + Fs + Fopp;
  const cou = (Fn * rayon)/(reducteur * (rend / 100));

  const puissance_tot = (cou * v_ang) / (rend / 100);
  const puissance = puissance_tot / nb_moteur;

  const I = puissance / tension;
  const bat = I * (temps / 60);


  // Affichage résultats dans les inputs
  document.getElementById("resultat_puissance_tot").value = puissance_tot.toFixed(2);
  document.getElementById("resultat_puissance").value = puissance.toFixed(2);
  document.getElementById("resultat_vitesse_angulaire").value = v_ang.toFixed(2);
  document.getElementById("resultat_couple").value = cou.toFixed(2);
  document.getElementById("resultat_courant").value = I.toFixed(2);
  document.getElementById("resultat_batterie").value = bat.toFixed(2);

  // Afficher la section résultats si cachée
  const sectionResu = document.getElementById("resu");
  if (sectionResu.style.display === "none" || sectionResu.style.display === "") {
    sectionResu.style.display = "flex";
  }

  // Calcul pour la courbe puissance en fonction de la vitesse
  // On génère plusieurs points entre 0 et vitesse * 2 pour lisser la courbe
  const vitesses = [];
  const puissances = [];
  const nbPoints = 30;
  for(let i = 0; i <= nbPoints; i++) {
    const v = (vitesse * 2) * (i / nbPoints);
    const v_ang_temp = (v / rayon)* reducteur;
    const Fopp_temp = (0.5 * Den * C * sur * v * v) + (masse * g * Crr);
    const Fn_temp = Fa + Fs + Fopp_temp;
    const cou_temp = (Fn_temp * rayon) / (reducteur * (rend / 100));
    const p = (cou_temp * v_ang_temp) / (rend / 100);
    vitesses.push(v.toFixed(2));
    puissances.push(Math.round(p * 100) / 100);
  }

  const ctx = document.getElementById('monGraphique').getContext('2d');

  if (monGraphique) {
    monGraphique.data.labels = vitesses;
    monGraphique.data.datasets[0].data = puissances;
    monGraphique.update();
  } else {
    monGraphique = new Chart(ctx, {
      type: 'line',
      data: {
        labels: vitesses,
        datasets: [{
          label: 'Puissance en fonction de la vitesse',
          data: puissances,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          tension: 0.3,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 4
        }]
      },
      options: {
  plugins: {
    legend: {
      labels: {
        color: 'rgba(44, 62, 80)',
        font: {
          family: 'Century Gothic', // Exemple : Arial, mais tu peux mettre n'importe quelle police
          size: 14,
          weight: 'bold'
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'rgba(44, 62, 80)',
        font: {
          family: 'Century Gothic',
          size: 12,
          weight: 'bold'
        }
      },
      title: {
        display: true,
        text: 'Vitesse (m/s)',
        color: 'rgb(44, 62, 80)',
        font: {
          family: 'Century Gothic',
          size: 14,
          weight: 'bold'
        }
      }
    },
    y: {
      ticks: {
        color: 'rgb(44, 62, 80)',
        font: {
          family: 'Arial',
          size: 12,
          weight: 'bold'
        }
      },
      title: {
        display: true,
        text: 'Puissance (W)',
        color: 'rgb(44, 62, 80)',
        font: {
          family: 'Arial',
          size: 14,
          weight: 'bold'
        }
      }
    }
  }
}

    });
  }
});

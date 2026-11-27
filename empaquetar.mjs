import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
const out = process.argv[3];

const r = (dir, re, max = 99) =>
  fs.readdirSync(path.join(src, dir))
    .filter((f) => f.endsWith(".mp3") && re.test(f))
    .sort()
    .slice(0, max)
    .map((f) => path.join(dir, f));

const grupos = {
  aviso: ["player/melee/shared/charged_melee_full.mp3"],
  swing: r("player/melee/shared", /^swing_charged_\d+/),
  impacto: r("hit_indicators", /^melee_impact_heavy_\d+/),
  dolor: r("hit_indicators", /^damage_receive_melee_\d+/),
  parryCast: ["player/melee/shared/melee_parry_cast.mp3"],
  parryExito: ["player/melee/shared/melee_parry_success.mp3"],
  haze: r("weapons/haze", /^haze_weapon_fire_\d+/),
  abrams: r("weapons/abrams", /^abrams_wpn_fire_\d+/),
  wraith: r("weapons/wraith", /^wraith_weapon_fire_\d+/),
  seven: r("weapons/gigawatt", /^gigawatt_weapon_fire_\d+/),
  infernus: r("weapons/inferno/fire", /^inferno_weapon_fire_\d+/),
  zumbido: [...r("weapons/shared/whizby", /^default_weapon_whizby_groupa/, 6), ...r("weapons/haze", /whizby_groupa/, 5)],
  rebote: r("weapons/shared/impacts", /^default_weapon_impacts_groupa-/, 6),
  recibes: r("hit_indicators", /^damage_receive_default_\d+/),
  das: r("hit_indicators", /^damage_send_default_\d+/),
  critico: r("hit_indicators", /^damage_send_crit_\d+/, 3),
  habilidad: [
    "abilities/abrams/a2_charge/abrams_charge_hero_impact_01.mp3",
    "abilities/abrams/a4_leap/abrams_a4_slam_impact.mp3",
    "abilities/bebop/a2_sticky_bomb/explode_01.mp3",
    "abilities/bebop/a2_sticky_bomb/explode_02.mp3",
    "abilities/bebop/a3_hook/impact_success.mp3",
    "abilities/gigawatt/gigawatt_lightning_ball_explode.mp3",
    "abilities/gigawatt/gigawatt_storm_cloud_bolt_explo_01.mp3",
    "abilities/gigawatt/gigawatt_storm_cloud_bolt_explo_03.mp3",
    "abilities/haze/haze_sleep_dagger_cast.mp3",
    "abilities/inferno/a1_incendiary_grenade/inferno_grenade_impact_01.mp3",
    "abilities/inferno/a4_stun_bomb/inferno_firebomb_explo.mp3",
    "abilities/inferno/a3_ignite/inferno_afterburn_explode.mp3",
    "abilities/inferno/a2_flame_dash/inferno_flame_dash_start.mp3",
    "abilities/abrams/abrams_a2_charge_cast_01.mp3",
  ],
};

let total = 0;
const datos = {};
for (const [k, lista] of Object.entries(grupos)) {
  if (!lista.length) throw new Error("grupo vacío: " + k);
  datos[k] = lista.map((p) => {
    const b = fs.readFileSync(path.join(src, p));
    total += b.length;
    return b.toString("base64");
  });
  console.log(k.padEnd(11), lista.length);
}
fs.writeFileSync(out, "window.SONIDOS=" + JSON.stringify(datos) + ";");
console.log("MB", (total / 1048576).toFixed(2), "->", (fs.statSync(out).size / 1048576).toFixed(2));

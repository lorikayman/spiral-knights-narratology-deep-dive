# Metamodern Gremlin of Cradle - Influence Map

Revised influence-mapping graph for the Gremlin species, grounded in
`src/lib/burning_stars.md` -> Final Chapter -> "A Metamodern Gremlin of Cradle"
(and the species' lore chapter IX). Supersedes the `gremlins.drawio` draft.

## Purpose

This version is organized as a character analysis tool.

The species sits at the center as the hub, and every other node is sorted into one of five analytical layers, with the authorial (Doylist) genealogy kept visually distinct from in-fiction (Watsonian) role and meaning.

## Edge vocabulary

_typed, not interchangeable_

| Edge | Meaning |
| ---- | ------- |
| `inspires` / `reinvented by` | Doylist lineage between real-world referents |
| `define anatomy` / `define character` / `habitat logic` | a referent contributes a specific component to the species |
| `manifests` | species -> a body/design trait it actually has in-game |
| `functions as` | species -> a role it performs in story or setting |
| `embodies` | a design or role -> the theme it carries |
| `oscillates` (bi-directional) | the metamodern comic <-> serious tension |

## The five layers


- Role in the story (Liminal Thresholds)

- Role in the setting (Symbolic Configuration)

- Themes (Hyperreal Margin)



```mermaid
flowchart TD
  GREMLINS["GREMLINS (Spiral Knights)"]
  MEGASTRUCTURE["Megastructure (Cradle / Clockworks):
    Axis Mundi,
    Cosmic Egg,
    Celestial Prison"]
  THESIS["THESIS: celestial/divine phenomena systematized through hyperadvanced technology and wielded by a highly animalistic, vermin-like, semi-comedic, militaristic species"]

  %% Authorial inspiration (fae folklore -> wartime aircraft Gremlin -> Dahl -> Gremlins 1984), and the precise component each donates.
  subgraph GENES["Doylist genealogy"]
    direction TB
    FAE["Fae folk (folklore): the mythological sphere of unknown"]
    GREMLINS_FOLKLORE["Gremlins (Wartime aircraft folklore): source of malfunction, inhabit factories/aircrafts"]
    GREMLINS_1943["Gremlins (The Gremlins, 1943):
      elf-like fae folk,
      natural habitat replaced with machinery,
      war victims, masters of technology"]
    MOGWAI["Mogwai (Gremlins, 1984):
      furred, non-hostile design,
      self-conscious"]
    GREMLINS_1984["Gremlins (Gremlins, 1984):
      reptilian, carnivore, evil/mischief-bearing,
      somatosensory homunculus, manifested id/shadow of mogwai"]
  end

  subgraph BODY["Character Appearances"]
    direction TB
    ANATOMY["Animalistic body:
      vermin, furry, apex predators"]
    UNIFORM["Uniform/culture presentation:
      armored vest, slim/baggy/hoody streetwear,
      tools-as-weapons,
      goggles,
      identity concealment"]
  end

  subgraph SETTING["Role in the setting"]
    direction TB
    BUILDERS["Builders of the megastructure"]
    PRISON["Imprisoned in their creation"]
    EMPIRE_PAST["Fallen kingdom:
      (myth of) an absent philosopher-king,
      greek architecture,
      bears lost technology (most advanced/Core-related technology),
      lack of limits,
      metaphysical unity,
      white/blue/yellow/gold color motif"]
    IMPERIAL_MOTIF["Imperial motif:
      totalitarian regime,
      roman/imperial architecture,
      wonder-weapons,
      weaponized metaphysics (shadow damage technology),
      struggling existence ("Mettle of a gremlin"),
      red/black/white color motif"]
    FALL["Loss of agency/prosperity:
      megastructure seiged by Underworld (failure to address it),
      failing state,
      guradians of megastructure turned prisoners,
      create and conceal eldrith/comsic/body horror (Swarm/undeath)"]
    SABOTAGE["Presented means for agents of chaos to emerge (Herex)"]
  end

  subgraph ROLE["Role in the story"]
    direction TB

    ANTAGONISTS["Primary antagonists:
      tutorial's major enemy,
      concealed by subplots"]
    COMIC["Comic-relief villains:
      fail to a single knight,
      episodic,
      never are an actualized threat"]
    CONCEAL["Conceal true threat and conflict (Swarm, Sleeper/Core/megastructure origin)"]
    SHIFT["Perpetuate tone shift of Tier 2 to 3:
      lay foundations for grim, serious, true, endgame narrative tied to the megastructure"]
  end

  subgraph THEMES["Themes"]
    direction TB
    METAMODERN["Metomodern oscillation:
      enthusiasm<->horror,
      comedy<->serious"]
    HUMAN["Humanity of Gremlins:
      struggle and human condition<->comedic, failing villainy"]
    CRIT["Industrialization self-critique/self-conscious warning"]
    KARMA["Karmic consequences:
      loss of agency, failing state,
      failure of resolution,
      creation/concealment/spread of Swarm,
      containment/spread of undeath,
      tricked/sieged by Underworld"]
  end

  %% A: genealogy and the components each donates
  %% FAE -->|inspires| GAVF
  %% AVF -->|inspires| GDAHL
  %% FAE -->|inspires| MOG
  %% FAE -->|inspires| G84
  %% AVF -->|reinvented by| MOG
  %% AVF -->|reinvented by| G84
  %% MOG ==>|define anatomy| GREM
  %% G84 ==>|define character| GREM
  %% DAHL -->|habitat logic| GREM
  %% AVF ==>|"name => tech-relation (malfunction subverted)"| GREM

  %% B: design
  %% GREM -->|manifests| ANIM
  %% GREM -->|manifests| UNIF
  %% GREM -->|manifests| GOG
  %% GOG --> GOGS
  %% GOG --> GOGC
  %% GOG --> CONC

  %% C: story role + oscillation spine
  %% GREM -->|functions as| TUT
  %% TUT --> COMIC
  %% COMIC -->|surface hides depth| CONCEAL
  %% COMIC <-->|oscillation spine| SHIFT

  %% D: setting role + bi-directional bond with the megastructure
  %% GREM -->|functions as| BUILD
  %% BUILD ==>|creates, then imprisoned by| MEGA
  %% MEGA ==>|gives character + stage for stakes| GREM
  %% BUILD --> PRISON
  %% GREM -->|functions as| MILIT
  %% EARLY -->|fall from grace| MILIT
  %% PRISON --> FALL
  %% MILIT --> FALL
  %% FALL --> HEREX
  %% HEREX -.->|escalates| CONCEAL

  %% E: convergence on themes, then thesis
  %% COMIC ==>|embodies| META
  %% SHIFT ==>|embodies| META
  %% ANIM ==>|embodies| HUMAN
  %% PRISON ==>|embodies| HUMAN
  %% BUILD ==>|embodies| CRIT
  %% MEGA ==>|embodies| CRIT
  %% GOGC ==>|embodies| HORR
  %% ANIM ==>|embodies| HORR
  %% COMIC ==>|embodies| HORR
  %% HORR -->|bridges to endgame| CONCEAL
  %% META --> THESIS
  %% HUMAN --> THESIS
  %% CRIT --> THESIS
  %% HORR --> THESIS

  %% class GREM,MEGA,THESIS prot;
  %% class FAE,AVF,DAHL,MOG,G84 doylist;
  %% class ANIM,UNIF,GOG,GOGS,GOGC,CONC design;
  %% class TUT,COMIC,CONCEAL,SHIFT story;
  %% class BUILD,PRISON,MILIT,EARLY,FALL,HEREX setting;
  %% class META,HUMAN,CRIT,HORR theme;
```

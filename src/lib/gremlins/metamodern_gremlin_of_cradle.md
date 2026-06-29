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
| `oscillation spine` (bi-directional) | the metamodern comic <-> serious tension |

## The five layers

- **A. Doylist genealogy** - authorial inspiration (fae folklore -> wartime aircraft Gremlin -> Dahl -> Gremlins 1984), and the precise component each donates.
- **B. Design and body** - the standalone species: animalistic anatomy, vermin voice, industrial uniform and its properties.
- **C. Role in the story** - tutorial first-threat, comic-relief villainy followed by the Swarm-Herex-Core endgame, and the tone shift that creates oscillation.
- **D. Role in the setting** - builders imprisoned in their own megastructure; imperial militarism (Iron Law, Crimson Order); Early Empire fall from grace; loss of control motif.
- **E. Themes** - metamodern oscillation, the humanity of Gremlins, industrialization self-critique, horror actualization.

```mermaid
flowchart TD
  GREM["GREMLINS (species)"]
  MEGA["The Megastructure / Clockworks (co-character)"]
  THESIS["THESIS: complex technology wielded by a highly<br/>animalistic, semi-comedic, militaristic species"]

  subgraph A["A. Doylist genealogy (authorial inspiration)"]
    direction TB
    FAE["Fae folk of folklore (the mythological sphere of unknown)"]
    AVF["Wartime aircraft 'Gremlin' folklore (= malfunction)"]
    DAHL["Dahl, 'The Gremlins' 1943 (habitat removed -> machinery)"]
    MOG["Mogwai, Gremlins (1984): furred anatomy"]
    G84["Gremlin, Gremlins (1984): digitigrade, mischief-emitting, vermin-like"]
  end

  subgraph B["B. Design and body (standalone species)"]
    direction TB
    ANIM["Animalistic body: fur/carnivore, digitigrade, vermins, raspy 'vermin' voice"]
    UNIF["Industrial slim-to-baggy cloth uniform"]
    GOG["GOGGLES (defining feature)"]
    GOGS["slitted lens = mischief (friendly / Emberlight)"]
    GOGC["circular lens = horror (Void Gremlin / Darkfang clan / possessions / Tier 3 tone)"]
    CONC["concealed eyes = unknown, unpredictable intent"]
  end

  subgraph C["C. Role in the story"]
    direction TB
    TUT["Tutorial first threat (microcosm of story); fails to one knight"]
    COMIC["Comic-relief villains (episodic, never an actualized threat)"]
    CONCEAL["conceals the endgame of Swarm and Core"]
    SHIFT["tone shift (King of Ashes; T2->T3): grim, serious"]
  end

  subgraph D["D. Role in the setting"]
    direction TB
    BUILD["Builders of the megastructure"]
    PRISON["imprisoned in their creation (post-Swarm)"]
    MILIT["Imperial militarism: Iron Law + Crimson Order + facilities + weapons"]
    EARLY["Early Gremlin Empire (king, limitless Core, pact intact; white/blue/yellow + gold colors)"]
    FALL["Failing empire / loss of control (seige by Underworld and socio-political erosion)"]
    HEREX["agent of chaos: Herex"]
  end

  subgraph E["E. Themes (meaning)"]
    direction TB
    META["METAMODERN OSCILLATION (enthusiasm <-> irony)"]
    HUMAN["Humanity of Gremlins (struggle and human condition)"]
    CRIT["Industrialization self-critique (= self-conscious warning)"]
    HORR["Horror re-emergence -> cosmic horror"]
  end

  %% A: genealogy and the components each donates
  FAE -->|inspires| AVF
  AVF -->|inspires| DAHL
  FAE -->|inspires| MOG
  FAE -->|inspires| G84
  AVF -->|reinvented by| MOG
  AVF -->|reinvented by| G84
  MOG ==>|define anatomy| GREM
  G84 ==>|define character| GREM
  DAHL -->|habitat logic| GREM
  AVF ==>|"name => tech-relation (malfunction subverted)"| GREM

  %% B: design
  GREM -->|manifests| ANIM
  GREM -->|manifests| UNIF
  GREM -->|manifests| GOG
  GOG --> GOGS
  GOG --> GOGC
  GOG --> CONC

  %% C: story role + oscillation spine
  GREM -->|functions as| TUT
  TUT --> COMIC
  COMIC -->|surface hides depth| CONCEAL
  COMIC <-->|oscillation spine| SHIFT

  %% D: setting role + bi-directional bond with the megastructure
  GREM -->|functions as| BUILD
  BUILD ==>|creates, then imprisoned by| MEGA
  MEGA ==>|gives character + stage for stakes| GREM
  BUILD --> PRISON
  GREM -->|functions as| MILIT
  EARLY -->|fall from grace| MILIT
  PRISON --> FALL
  MILIT --> FALL
  FALL --> HEREX
  HEREX -.->|escalates| CONCEAL

  %% E: convergence on themes, then thesis
  COMIC ==>|embodies| META
  SHIFT ==>|embodies| META
  ANIM ==>|embodies| HUMAN
  PRISON ==>|embodies| HUMAN
  BUILD ==>|embodies| CRIT
  MEGA ==>|embodies| CRIT
  GOGC ==>|embodies| HORR
  ANIM ==>|embodies| HORR
  COMIC ==>|embodies| HORR
  HORR -->|bridges to endgame| CONCEAL
  META --> THESIS
  HUMAN --> THESIS
  CRIT --> THESIS
  HORR --> THESIS

  classDef prot fill:#ffd9b3,stroke:#cc6600,stroke-width:2px;
  classDef doylist fill:#e6e0f8,stroke:#6a4ca5;
  classDef design fill:#d5e8d4,stroke:#479d4e;
  classDef story fill:#dae8fc,stroke:#3b6fb6;
  classDef setting fill:#ffe6cc,stroke:#d79b00;
  classDef theme fill:#f8cecc,stroke:#b85450;
  class GREM,MEGA,THESIS prot;
  class FAE,AVF,DAHL,MOG,G84 doylist;
  class ANIM,UNIF,GOG,GOGS,GOGC,CONC design;
  class TUT,COMIC,CONCEAL,SHIFT story;
  class BUILD,PRISON,MILIT,EARLY,FALL,HEREX setting;
  class META,HUMAN,CRIT,HORR theme;
```

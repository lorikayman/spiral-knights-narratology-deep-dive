# Metamodern Gremlin of Cradle: Influence Map

<!--Here we attempt to truncate the essay, the setting, as being built from archetypal material, so stripping the lore does not expose neutral structure (albeit it would be fitting but more verbose), exposing the archetypal layer, whose traditional names/tokens are mythologems. Mythologems behave in this case as the densest tokens available for pattern-shaped emotionally-charged by the player meaning proposed in the essay.-->

```mermaid
flowchart TD
  THESIS["THESIS: celestial/divine phenomena systematized through hyperadvanced technology and wielded by a highly animalistic, vermin-like, semi-comedic, militaristic species. Karmic consequences manifest in (supernatural/divine) power of their creation (megastructure) becoming uncontrolled."]

  %% Authorial inspiration (fae folklore -> wartime aircraft Gremlin -> Dahl -> Gremlins 1984), and the precise component each donates.
  subgraph GENES["Doylist genealogy"]
    direction TB
    FAE["Fae folk (folklore): the mythological sphere of the unknown"]
    GREMLINS_FOLKLORE["Gremlins (Wartime aircraft folklore): source of malfunction, inhabit factories/aircraft"]
    GREMLINS_1943["Gremlins (The Gremlins, 1943):
      elf-like fae folk,
      natural habitat replaced with machinery,
      multifaceted connection to war,
      masters of technology"]
    MOGWAI["Mogwai (Gremlins, 1984):
      furred, non-hostile design,
      self-conscious"]
    GREMLINS_1984["Gremlins (Gremlins, 1984):
      reptilian, carnivore, evil/mischief-bearing,
      somatosensory homunculus, manifested id/shadow of mogwai"]
  end

  subgraph BODY["Character Appearances"]
    direction TB
    GREMLINS["GREMLINS (Spiral Knights)"]
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
    MEGASTRUCTURE["Megastructure (Cradle / Clockworks):
      Axis Mundi,
      Cosmic Egg,
      Celestial Prison"]
    BUILDERS["Builders of the megastructure"]
    PRISON["Imprisoned in their creation"]
    PAST["Fallen kingdom:
      (myth of) an absent philosopher-king,
      greek architecture,
      bears lost technology (most advanced/Core-related technology),
      lack of limits,
      metaphysical unity,
      white/blue/yellow/gold color motif"]
    IMPERIAL["Imperial motif:
      totalitarian regime,
      roman/imperial architecture,
      wonder-weapons,
      weaponized metaphysics (shadow damage technology),
      struggling existence ('Mettle of a gremlin'),
      red/black/white color motif"]
    FALL["Loss of agency/prosperity:
      megastructure besieged by Underworld (failure to address it),
      failing state,
      guardians of megastructure turned prisoners,
      create and conceal eldritch/cosmic/body horror (Swarm/undeath)"]
    SABOTAGE["Notions of agents of chaos to emerge (Herex)"]
  end

  subgraph ROLE["Role in the story"]
    direction TB

    ANTAGONISTS["Primary antagonists:
      tutorial's major enemy,
      concealed by subplots"]
    COMIC["Comic-relief villains:
      fall to a single knight,
      episodic,
      never are an actualized threat"]
    CONCEAL["Conceal true threat and conflict (Swarm, Sleeper/Core/megastructure origin)"]
    SHIFT["Perpetuate tone shift of Tier 2 to 3:
      lay foundations for grim, serious, endgame narrative tied to the megastructure"]
  end

  subgraph THEMES["Themes"]
    direction TB
    METAMODERN["Metamodern oscillation:
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
  FAE ==>|inspires| GREMLINS_FOLKLORE

  GREMLINS_FOLKLORE -->|inspires| GREMLINS_1943

  FAE -->|inspires| MOGWAI
  FAE -->|inspires| GREMLINS_1984

  GREMLINS_FOLKLORE -->|reinvented by| MOGWAI
  GREMLINS_FOLKLORE -->|reinvented by| GREMLINS_1984
  GREMLINS_1943 -->|inspires| GREMLINS_1984

  MOGWAI ==>|provide anatomy| GREMLINS
  GREMLINS_1984 ==>|provide character| GREMLINS
  GREMLINS_FOLKLORE -->|setting logic| GREMLINS

  %% B: design
  GREMLINS -->|manifests| ANATOMY
  MOGWAI -.->|provides| ANATOMY
  GREMLINS -->|manifests| UNIFORM
  GREMLINS_1943 -->|shared industry inspires| UNIFORM

  %% setting
  GREMLINS --> BUILDERS
  GREMLINS --> IMPERIAL
  GREMLINS --> MEGASTRUCTURE
  BUILDERS ==> MEGASTRUCTURE
  MEGASTRUCTURE ==> GREMLINS
  GREMLINS_1943 -->|artificial habitat becomes megastructure by| GREMLINS
  MEGASTRUCTURE -.->|provides| PRISON
  GREMLINS_1943 -.->|provides habitat reinvented as| MEGASTRUCTURE
  GREMLINS_1943 -->|provides wartime struggle escalated into| IMPERIAL

  PAST -->|fall from grace| IMPERIAL
  FALL -->|reveals| PAST
  FALL -->|provides| IMPERIAL
  FALL -.->|manifests| PRISON
  SABOTAGE -->|manifests| IMPERIAL
  IMPERIAL -->|manifests| PRISON
  SABOTAGE -->|manifests| FALL
  IMPERIAL -->|provides| CONCEAL
  SABOTAGE -->|reveals| CONCEAL
  GREMLINS_1943 -->|Horrors of wartime artifice become existential| CONCEAL

  %% story
  GREMLINS -->|functions as| ANTAGONISTS
  GREMLINS -->|manifest| COMIC
  GREMLINS -->|manifest| CONCEAL
  COMIC -->|manifest| CONCEAL
  COMIC -->|oscillates| CONCEAL
  COMIC -.->|oscillates| SHIFT
  SHIFT -.->|reveals| FALL
  SHIFT -.->|manifests| CONCEAL
  ANTAGONISTS -->|reveals| CONCEAL

  %% convergence on themes
  COMIC --> METAMODERN
  SHIFT --> METAMODERN

  ANATOMY -->|embodies| HUMAN
  MEGASTRUCTURE ==> HUMAN
  GREMLINS_1943 ==> HUMAN
  FALL --> HUMAN
  IMPERIAL --> HUMAN
  PAST --> HUMAN
  SABOTAGE --> HUMAN
  IMPERIAL --> CRIT

  BUILDERS ==>|embodies| CRIT
  MEGASTRUCTURE ==>|embodies| CRIT

  CONCEAL -->|reveals| KARMA
  IMPERIAL -.->|manifests| KARMA
  SABOTAGE -.->|manifests| KARMA
  FALL -.->|manifests| KARMA
  PRISON -.->|manifests| KARMA

  MEGASTRUCTURE ==> THESIS
  CONCEAL ==> THESIS
  GREMLINS ==> THESIS
  METAMODERN --> THESIS
  HUMAN --> THESIS
  CRIT --> THESIS
  KARMA --> THESIS
```

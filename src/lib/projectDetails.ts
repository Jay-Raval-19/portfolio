// Rich detail content for each project's dedicated page (/projects/<slug>).
// Kept free of server/Supabase imports so it can be used from client components.

import { ProjectTheme } from './projectMeta';

export type DetailStat = { label: string; value: string };

export type DetailImage = {
  src: string;
  alt: string;
  caption?: string;
  // Diagrams exported on white need a light backing plate in dark mode.
  plate?: boolean;
};

export type DetailSection = {
  heading: string;
  // Paragraph text; split on blank lines into separate <p> blocks.
  body?: string;
  bullets?: string[];
  // Preformatted pseudocode, rendered in a monospace panel.
  code?: string;
  // Key of a named inline figure rendered by ProjectDetail.
  figure?: string;
  images?: DetailImage[];
};

export type DetailLink = { label: string; href: string };

export type ProjectDetail = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  date: string;
  theme: ProjectTheme;
  overview: string;
  tags: string[];
  stats?: DetailStat[];
  sections: DetailSection[];
  links?: DetailLink[];
};

export const projectDetails: Record<string, ProjectDetail> = {
  'spectral-index-eo': {
    slug: 'spectral-index-eo',
    title: 'Spectral Index - EO Model',
    tagline:
      'Do Earth-observation foundation models compute spectral indices, or only make them linearly decodable? A pre-registered test across all 15 band-pair ratios and six Prithvi-EO-2.0 variants.',
    role: 'Research · Interpretability · Massive Data Mining',
    date: 'Sep - Oct 2026',
    theme: 'emerald',
    overview:
      'Spectral indices like NDVI, NDWI and NBR are normalized differences of two satellite bands, and a linear probe can read them out of Earth-observation foundation models. That shows the information is present, not that the model computes anything with it. This project tests it with an exact property of ratios, applied to every one of the 15 band pairs (seven with standard names, eight without), across six Prithvi-EO-2.0 variants, with untrained copies and known-answer models as baselines and every threshold committed to version control before the results existed.',
    tags: [
      'PyTorch',
      'Prithvi-EO-2.0',
      'Mechanistic Interpretability',
      'Linear Probes',
      'Pre-registration',
      'HLS Imagery'
    ],
    stats: [
      { label: 'Band-pair ratios tested', value: '15' },
      { label: 'Prithvi variants', value: '6' },
      { label: 'Layer-pair evaluations', value: '1,590' },
      { label: 'Model-pair cells present', value: '89 / 90' },
      { label: 'HLS tiles processed', value: '11,274' },
      { label: 'Global sites', value: '100' },
      { label: 'Cluster GPU jobs', value: '120+' },
      { label: 'Thresholds tuned post hoc', value: '0' }
    ],
    sections: [
      {
        heading: 'Decodability is not computation',
        body: 'The usual evidence that a model "knows" an index is a linear probe that predicts it. But spectral bands co-vary strongly in natural scenes, and randomly initialised copies of the same network can support probe readouts too. A good probe score says the information is present, not that training put a ratio computation into the network. The practical stake: a model that computes an index should stay stable when brightness changes (haze, sun angle, season), while one that merely carries correlated information guarantees nothing.',
        images: [
          {
            src: '/images/projects/spectral-index-eo/fig2_decodability.png',
            alt: 'Held-out R² versus ratio residual for probe readouts',
            caption:
              'Every probe readout by held-out R² against ratio residual. Untrained copies (grey) are often as decodable as trained ones but are never ratio-type; planted controls (orange) sit at low residual.',
            plate: true
          }
        ]
      },
      {
        heading: 'A test from the algebra of ratios',
        body: 'A normalized difference (a-b)/(a+b) is unchanged when both bands are scaled by the same factor. So instead of reading weights, the test nudges the input bands and watches how a feature responds. Each band is scaled up and down by a small log step in reflectance space, before the model\'s input normalisation, and the response is measured by central differences. A true ratio responds to its two bands with equal and opposite strength, so its log-elasticities sum to zero.',
        bullets: [
          'Residual: how far the response is from a perfect ratio (0 for an exact ratio, 1 for nothing like one)',
          'Direction: whether it responds to the right two bands with the right signs, scored against 22 templates (15 pairs, 6 single bands, brightness)',
          'Margin: how clearly the intended pair beats the runner-up pair',
          'Magnitude: a noise floor, so near-dead features cannot look ratio-like by chance'
        ],
        images: [
          {
            src: '/images/projects/spectral-index-eo/invariance.jpg',
            alt: 'A real Iowa cropland scene at three brightness levels, with NDVI and NIR minus Red below each',
            caption:
              'The premise, on a real HLS scene. Scaling every band leaves NDVI identical to four decimal places (0.8398 in all three columns) while a plain band difference moves with the light, from 0.286 to 0.573. That exact cancellation is the signature the battery hunts for inside the model.',
            plate: true
          },
          {
            src: '/images/projects/spectral-index-eo/fig1_fingerprints.png',
            alt: 'Elasticity fingerprints of exact ratios, a band difference and brightness',
            caption:
              'Ratios put equal and opposite weight on their two bands and sum to zero; a band difference and brightness respond to overall scale.',
            plate: true
          }
        ]
      },
      {
        heading: 'Validating the instrument first',
        body: 'A negative result only means something if the test could have returned a positive, so the battery is checked before it touches Prithvi.',
        bullets: [
          'Formula check: all 15 exact normalized differences detected at every perturbation size, named and unnamed pairs scoring identically; decoys (single bands, brightness, NIR-Red, SAVI, EVI) rejected',
          'Known-answer models: Prithvi encoders trained so a linear head must compute each of the 15 ratios; every planted head recovered in every run across four widths and three seeds, after retraining the 600M controls for longer',
          'Untrained-copy nulls: five random-weight copies per architecture, every layer, every pair; the pre-registered cutoff is 0.9 x the best untrained residual',
          'A pair counts as testable only if its known-answer model clears that cutoff, so a failure cannot be mistaken for absence'
        ]
      },
      {
        heading: 'What the evidence supports',
        body: 'Ratio-like, brightness-invariant structure is linearly recoverable from Prithvi at a level untrained networks never reach: in all 90 model-by-pair cells the best trained layer beats every untrained measurement, and 89 of the 90 verdicts read "present". The most robust pair is not a named index. Blue-Red is claimable at every layer under the strictest cutoff in five of the six architectures, while NDVI, which a probe predicts more accurately (R² 0.95 against 0.69), loses layers as the cutoff tightens. Raw reflectance gives a linear readout only 0.48 R² for NDVI against 0.95 from Prithvi, and the strongest readouts sit in the first few layers.',
        bullets: [
          '688 of 1,590 layer-pair evaluations pass all five claim criteria (residual, direction, margin, held-out R² of at least 0.5, certified control)',
          'Real image pairs with no perturbation at all: the trained model beats the best untrained copy in 71 of 75 cells, with a median advantage of 1.8x that grows from 1.2x in the tiny model to 2.2x at 600M',
          'Neuron census: 28 strict ratio-type neurons in the trained model against 0 in every untrained copy, mostly visible-band pairs, and no NDVI neuron in any model',
          'Layer counts are soft: they shift with the cutoff, so the existence of the structure and the number of layers are reported separately'
        ],
        images: [
          {
            src: '/images/projects/spectral-index-eo/fig3_per_pair_300m.png',
            alt: 'Per-pair ratio residual by layer for Prithvi 300M-TL',
            caption:
              'Ratio residual of each named index\'s linear readout by layer in 300M-TL (lower is more ratio-like). Grey: untrained copies; orange: planted control; line: pre-registered cutoff.',
            plate: true
          },
          {
            src: '/images/projects/spectral-index-eo/claimable_layers.png',
            alt: 'Grid of which band pairs clear the full claim gate at each layer, for 300M-TL and 600M-TL',
            caption:
              'Every pair against every layer, filled where all five claim criteria hold at once. Blue-Red, which has no standard name, is the only pair filled end to end in both models, and four unnamed pairs outrank NBR, NBR2 and NDMI. Asterisks mark the seven pairs humans named.',
            plate: true
          }
        ]
      },
      {
        heading: 'What a single neuron looks like',
        body: 'Readouts are fitted, so a sceptic can always argue the ratio behaviour came from the fitting rather than the model. Individual neurons remove that objection, because nothing is fitted to them at all.\n\nScoring every neuron at nine depths of 300M-TL finds 28 that pass the strict battery, against zero in each of three untrained copies, and 12 of the 28 sit at layer 0. Rescored on more than twice the data, the strongest survive and sharpen: one unit lands on the SWIR1 to SWIR2 ratio at residual 0.046, where the same unit index in an untrained copy scores 0.537 and classifies as a plain band detector. The same pair reappears as a single neuron in the smallest model at residual 0.038, which is the one result here that replicates across architectures.\n\nSeven of those units were then characterised on all 260,978 valid patches: the ground that excites them, the index that best explains them, and the shape of that response. The last of those matters more than it sounds, because a rank correlation only sees a steady rise or fall, and a unit can answer in other shapes. Pick one below.',
        bullets: [
          'Strict counts hold at 25 to 28 against zero across every perturbation size from 0.01 to 0.2',
          'Visible-band pairs are nearly exclusive to the trained model: Green-Red 62 against at most 1, Blue-Green 26 against 0',
          'There is no NDVI neuron anywhere, in any model, at any layer',
          'Honest limits: the surviving residuals sit just under the 0.05 threshold, and one candidate flipped from pass to fail when measured on more tokens',
          'Brightness is the honest caveat. A scale-invariant ratio should correlate 0.00 with overall brightness, and most of these units do not, which is why they are labelled near-ratio rather than clean',
          'The two directions come apart in both senses. The unit best explained by NDVI anywhere, at 76 percent of its variance, fails the ratio test; the unit with the lowest ratio residual is explained by no index measured here'
        ],
        figure: 'neuron-explorer'
      },
      {
        heading: 'Holding up outside the pilot',
        body: 'A result measured on five held-out sites could be a quirk of those five. So the readouts were refit and rescored on a worldwide split: 20 held-out sites spanning five continents, two years, and both growing and off seasons. Accuracy did not drop. Among cells that pass every claim criterion, the median held-out R² is 0.917, 0.916 and 0.931 for 300M-TL across the three test sets, and 0.925, 0.928 and 0.919 for 600M-TL, with the lowest value anywhere at 0.59.\n\nThe measurement itself was swept too. Every perturbation size from 0.01 to 0.2, a twentyfold range, returns the same verdict: 25 to 28 strict ratio-type neurons in the trained model against zero in every untrained copy, with Green-Red holding at 61 to 68 against at most one. Exactly one statement turned out to be step-size dependent, and it is reported as such rather than quietly dropped.',
        bullets: [
          'Cross-site, cross-year and cross-season: refit and rescored on 20 held-out sites over two years',
          'Perturbation size swept across a twentyfold range with no change to the strict result',
          'Intervals come from a cluster bootstrap that resamples whole sites, not patches, which makes them two to three times wider and far harder to fool'
        ]
      },
      {
        heading: 'The model on its own task',
        body: 'Every other experiment probes a frozen encoder. This one runs Prithvi the way it was actually trained: encoder and decoder together, random patches hidden, the missing reflectance predicted, scored only on the hidden patches and converted back into physical units.\n\nAt the 75 percent masking ratio used in pretraining, 300M-TL reconstructs held-out tiles with an NDVI mean absolute error of 0.119 and a red-band R² of 0.43, while 600M-TL reaches 0.095. Drop the mask to 25 percent and the NDVI error falls to 0.058. A randomly initialised copy, given identical tiles and an identical mask, returns an NDVI error of 0.43 and a red-band R² near -21. That gap is the one every interpretability claim here is measured against.',
        images: [
          {
            src: '/images/projects/spectral-index-eo/reconstruction.jpg',
            alt: 'Three held-out satellite tiles shown as truth, 75 percent masked input, reconstruction, and NDVI error',
            caption:
              'Prithvi 300M-TL on its own pretraining task, on sites it never saw during this study. Three quarters of each tile is hidden and the model fills it back in. Field boundaries, burn scars and centre-pivot circles return in roughly the right place; the error map shows where NDVI is recovered well and where edges are smoothed away.',
            plate: true
          }
        ]
      },
      {
        heading: 'What it does not show',
        body: 'The causal tests are where the claim stops. Removing a fitted direction costs far more downstream accuracy than removing a random one (0.3 to 1.1 R² against about zero over 4,200 random ablations), and swapping a direction between patches moves a downstream readout 15 to 50 percent of the way to the donor value against 1 to 2 percent for random directions. But the pre-registered pair-specificity test passes in only 57 of 180 cells, and the interchange reaches its target threshold in 10 of 285. The directions look like a shared, entangled basis rather than fifteen separate ratio computations.',
        bullets: [
          'The evidence stops short of showing that Prithvi computes any specific named index, or that it implements a division anywhere',
          'Likely account: a compact set of brightness-normalised spectral factors from which all 15 ratios are linearly recoverable',
          'Layer-normalisation can supply partial brightness invariance for free, which is why untrained baselines carry so much of the argument',
          'A dedicated branch reproduced every causal result without sparse autoencoders, confirming they are not required for this analysis; across seeds the dictionaries also recovered different features',
          'Open: downstream task heads under illumination shift, and other model families (SatMAE, SpectralGPT, CROMA)'
        ],
        images: [
          {
            src: '/images/projects/spectral-index-eo/fig4_causal.png',
            alt: 'Change in held-out R² after ablating each index direction, read at two later layers',
            caption:
              'Change in held-out R², in percentage points, after removing each index direction from the token stream. The strong effects run down the diagonal, but they spill across pairs, which is the entanglement the specificity test catches. The worst of twenty random directions stays near zero.',
            plate: true
          }
        ]
      },
      {
        heading: 'Running it',
        body: 'The study is 11,274 HLS tiles from 100 sites, roughly 6.5 GB, and about 120 GPU jobs on a Slurm cluster.',
        bullets: [
          '11,274 tiles, 100 sites, 20 held out, two years, growing and off seasons, cloud and snow screened by the Fmask quality layer',
          'Race-free task claiming by directory creation, with declared data dependencies and automatic retries',
          'Pre-flight validation of every queued command against its own argument parser',
          'A parallel branch reproduces the entire pipeline without sparse autoencoders, to test directly whether they were needed'
        ]
      }
    ],
    links: [
      {
        label: 'Code and experiment log',
        href: 'https://github.com/Jay-Raval-19/MDM-ResearchGroup-11'
      },
      {
        label: 'Prithvi-EO-2.0 (NASA / IBM)',
        href: 'https://arxiv.org/abs/2412.02732'
      },
      {
        label: 'HLS surface reflectance (Claverie et al.)',
        href: 'https://doi.org/10.1016/j.rse.2018.09.002'
      }
    ]
  },

  'riva-cervical-cytology': {
    slug: 'riva-cervical-cytology',
    title: 'RIVA Cervical Cytology Challenge',
    tagline:
      'Nucleus localisation & cell classification on Pap smears with a hybrid SSM–Transformer detection ensemble.',
    role: 'Deep Learning · CSE602 · Ahmedabad University',
    date: '2025',
    theme: 'rose',
    overview:
      'Cervical cancer is the 4th most common cancer in women globally (~600,000 new cases/year), and Pap smear cytology is the screening standard, but manual review needs scarce, expensive cytotechnologists. The RIVA challenge benchmarks automated nucleus localisation and Bethesda-system cell classification on 1,040 Pap smear images. Our approach fuses five complementary detectors into a single ensemble that reaches 0.571 mAP, a +0.019 gain over the strongest midsem baseline, with the headroom to pass 0.60 under full training.',
    tags: [
      'PyTorch',
      'MambaVision',
      'DINO-DETR',
      'Cellpose-SAM',
      'SAM ViT-B',
      'WBF',
      'Albumentations'
    ],
    stats: [
      { label: 'Pap smear images', value: '1,040' },
      { label: 'Nucleus annotations', value: '15,951' },
      { label: 'Ensemble mAP', value: '0.571' },
      { label: 'Gain vs midsem', value: '+0.019' }
    ],
    sections: [
      {
        heading: 'The problem',
        body: 'Two tracks on 1024×1024 Pap smear patches at 40× magnification. Track B (our focus) is a pure localisation task: detect every nucleus and output a ~50×50 bounding box, evaluated by mAP@0.50:0.95. Track A classifies each detected cell into a Bethesda category (NILM/INFL, ASCUS, LSIL, HSIL, ASC-H, SCC). The dataset ships only nucleus centre-point coordinates in CSV form.',
        bullets: [
          '1,040 images · 15,951 centre-point annotations · ~15.3 detections/image',
          'Split: 828 train (79.6%) · 131 val (12.6%) · 81 held-out test (7.8%)',
          'Class imbalance: NILM ~60% of cells, SCC/AGC <5%',
          'Dense overlap (20+ nuclei/patch), staining drift, and 15px–180px scale range'
        ]
      },
      {
        heading: 'Preprocessing & augmentation',
        body: 'With only 828 training images, heavy augmentation was essential. Pap smears appear at arbitrary orientations and suffer H&E staining drift across slides, so the pipeline leans on geometric, photometric, and noise transforms, with CLAHE doing the heavy lifting on stain normalisation.',
        bullets: [
          'Geometric: H/V flips, random 90° + ±45° rotation, elastic & grid distortion',
          'Photometric: brightness/contrast, HSV, CLAHE (p=0.55), gamma, channel shift/shuffle',
          'Noise & blur: Gaussian/ISO/multiplicative noise, median/motion blur, sharpening',
          'Regularisation: coarse dropout (2–6 holes) to simulate occluded nuclei'
        ]
      },
      {
        heading: 'Model 1 - DINO-DETR + MambaVision',
        body: 'The primary detector pairs a MambaVision-L backbone (a hybrid Mamba SSM + Transformer, ~200M params, ImageNet-1K pretrained) with a DINO-DETR head. MambaVision runs the full 1024×1024 image with O(n) selective scans, no patch-splitting, combining local nucleus texture (Mamba stages) with global cell layout (attention stages). Swapping ConvNeXtV2-L for MambaVision-L in the same DINO framework lifted val mAP 0.526 → 0.543 while cutting GPU memory ~18%.',
        bullets: [
          'Contrastive DeNoising (CDN) query pairs accelerate convergence 2–3×',
          'Mixed query selection + two-stage init for dense nucleus scenes',
          '300 object queries, 6 encoder / 6 decoder layers, Hungarian matching (no NMS)',
          'Focal cls loss + L1 (λ=5.0) + GIoU (λ=2.0) + CDN loss'
        ]
      },
      {
        heading: 'Model 2 - Cellpose-SAM (fine-tuned)',
        body: 'A segmentation-to-detection path that recovers touching nuclei the box detectors merge. We swapped the Cellpose U-Net encoder for a frozen SAM ViT-B (86M params, SA-1B pretrained) and trained ~2M adapter params. CSV centre points become circular pseudo-masks (per-class radii, e.g. NILM ≈22px, SCC ≈30px); flow-field gradients are simulated for 10 iterations, clustered into instance masks, then converted to boxes via cv2.boundingRect.',
        bullets: [
          'Point-supervised, no polygon masks needed, matches the RIVA CSV',
          'Flow fields separate occluded nuclei → +8% recall on dense clusters',
          'Loss: 1.0·BCE(flow) + 0.5·MSE(prob) + 0.5·Dice(mask), AdamW lr=5e-5',
          'Complementary to DINO, recovers nuclei box detectors miss'
        ]
      },
      {
        heading: 'Ensemble - Weighted Box Fusion',
        body: 'Rather than NMS (which discards corroborating predictions), WBF clusters overlapping boxes across all five models and fuses each cluster by confidence-weighted coordinate averaging. Each model specialises, YOLO on isolated cells, Faster R-CNN on medium density, TF-DETR on transformer context, DINO+MambaVision on dense recall, Cellpose-SAM on occluded nuclei, so their failure modes cover one another.',
        bullets: [
          'YOLOv11x (0.479, wt 0.20) · Faster R-CNN ConvNeXtV2 (0.509, wt 0.22)',
          'TF-DETR (0.526, wt 0.25) · DINO+MambaVision (0.543, wt 0.30)',
          'Cellpose-SAM FT (0.531, wt 0.28) → WBF ensemble 0.571',
          'Sliding-window inference (1024 tiles, 256px overlap), final NMS IoU 0.40'
        ]
      },
      {
        heading: 'Results & what’s next',
        body: 'On preliminary 1-epoch checkpoints the WBF ensemble reached 0.571 mAP, beating the midsem best (YOLO+FRCNN+TF-DETR, 0.552) by +0.019. Known failure modes: extreme density (>20 overlapping nuclei, recall ~0.35), mucus/debris artifacts confused with HSIL nuclei (~12% of FPs), and sub-15px lymphocyte nuclei. Full 50-epoch training is expected to add +5–8% mAP and push the ensemble past 0.60.',
        bullets: [
          'Full 50-epoch training on A100, expect ensemble > 0.60',
          'CellMamba: density-aware 4-directional SSM as a unified backbone',
          'Multi-scale TTA (+2–3%) and semi-supervised pseudo-labelling on test images',
          'Multi-task learning: joint Track A classification + Track B detection'
        ]
      }
    ],
    links: [
      {
        label: 'MambaVision (NVLabs)',
        href: 'https://github.com/NVlabs/MambaVision'
      },
      { label: 'DINO (ICLR 2023)', href: 'https://arxiv.org/abs/2203.03605' },
      { label: 'Cellpose', href: 'https://cellpose.readthedocs.io' },
      {
        label: 'Weighted Boxes Fusion',
        href: 'https://github.com/ZFTurbo/Weighted-Boxes-Fusion'
      }
    ]
  },

  'hybrid-p2p-cdn': {
    slug: 'hybrid-p2p-cdn',
    title: 'Hybrid P2P-CDN Content Delivery System',
    tagline:
      'A self-organizing mesh of lightweight Go peers backed by edge + origin servers: 78% cache hits, 65% lower bandwidth costs, 47% faster delivery.',
    role: 'Cloud Computing (CSE540) · Ahmedabad University',
    date: 'Sep - Nov 2025',
    theme: 'blue',
    overview:
      'Traditional CDNs treat end-user devices purely as consumers, leaving their collective bandwidth and storage untapped. This project builds a hybrid architecture where every client also runs a 15 MB Go peer that caches and serves HLS media segments to its neighbours, while edge servers (PostgreSQL) and an origin (MinIO + FFmpeg) backstop availability. A three-service control plane: Tracker (Redis), Signalling (WebSocket), and Topology Manager (BFS routing) - orchestrates concurrent peer containers in a dynamic partial mesh. As a result, 78% of requests never leave the peer network, and average latency falls from 85 ms to 45 ms.',
    tags: [
      'Go',
      'Docker',
      'Redis',
      'PostgreSQL',
      'MinIO',
      'WebSocket',
      'HLS',
      'BFS Routing'
    ],
    stats: [
      { label: 'Cache hit ratio', value: '78%' },
      { label: 'Bandwidth cost', value: '-65%' },
      { label: 'Avg latency', value: '-47%' }
    ],
    sections: [
      {
        heading: 'The problem',
        body: 'Video streaming accounts for over 80% of internet traffic, and traditional CDNs answer it with a global fleet of edge servers - a linear relationship between market expansion and infrastructure cost that prices out smaller content providers. Flash crowds overwhelm provisioned capacity; over-provisioning wastes it the rest of the time.\n\nMeanwhile the largest resource pool sits idle: end-user devices collectively hold bandwidth and storage orders of magnitude beyond CDN infrastructure, yet conventional CDNs never let them serve content. This project turns every viewer into a distributor.',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/p2p-mesh.png',
            alt: 'Peers exchanging request/response messages in a mesh',
            caption:
              'Fig 1: P2P distribution taps the idle bandwidth and storage of end-user devices',
            plate: true
          }
        ],
        bullets: [
          'Each new geographic market means new edge PoPs',
          'Flash crowds (launches, live sport) overwhelm centralized capacity',
          'Edge outages black out whole regions: single points of failure',
          'Client devices are treated as consumers only, their resources go unused'
        ]
      },
      {
        heading: 'Three-tier architecture',
        body: 'Content flows through a delivery hierarchy: an origin server (master PostgreSQL + S3-compatible MinIO storage, with an FFmpeg pipeline that transcodes uploads into multi-bitrate HLS segments), a cluster of stateless edge servers each backed by PostgreSQL, and, the innovation, a self-organizing mesh of peer nodes that both consume and serve segments.\n\nA dedicated control plane of three Go microservices coordinates the overlay: the Tracker maintains a Redis-backed registry of peers, their regions, RTTs, and segment inventories; the Signalling Server pushes computed paths to peers over WebSockets; the Topology Manager holds the global connection graph in memory behind a reader-writer mutex and answers BFS path queries in microseconds.',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/three-tier.png',
            alt: 'Three-tier content delivery architecture: origin, edge servers, P2P layer',
            caption: 'Fig 2: Origin → edge → peer mesh delivery hierarchy',
            plate: true
          },
          {
            src: '/images/projects/hybrid-p2p-cdn/architecture.png',
            alt: 'Full system architecture with FFmpeg upload pipeline, origin, edge servers, peer nodes and topology service',
            caption:
              'Fig 3: Full system: FFmpeg HLS pipeline, origin, three edges with LRU caches, peer mesh, and monitoring',
            plate: true
          }
        ],
        bullets: [
          'Tracker Service: Go + Redis (:7070): registration, heartbeats, segment index, region-aware lookup',
          'Topology Manager: Go, in-memory graph (:8090): overlay maintenance, BFS shortest paths over measured RTTs',
          'Signalling Server: Go + WebSocket (:7080): NAT traversal, peer discovery, path broadcasting',
          'Origin: MinIO object storage + FFmpeg → adaptive-bitrate HLS (.m3u8 + .ts segments)',
          'Isolated Docker bridge networks: micro-net (control), edge-a/b-net, origin-net'
        ]
      },
      {
        heading: 'Segment request lifecycle',
        body: 'A player asks its local peer for a segment; everything after that is invisible to the client. The peer checks its own LRU cache, then asks the Tracker who else holds the segment, gets a BFS-computed multi-hop path from the Topology Manager, and pulls the segment across the mesh. Only if P2P fails does the request fall back to the nearest edge, and only if the edge misses does it touch the origin.',
        figure: 'cdn-fallback',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/sequence-diagram.png',
            alt: 'Sequence diagram covering upload, P2P request flow, edge fallback and monitoring',
            caption:
              'Fig 4: End-to-end sequences: song upload & HLS processing, P2P delivery, edge fallback, monitoring',
            plate: true
          }
        ]
      },
      {
        heading: 'Path-striping cache-fill',
        body: 'When a request does fall through to an edge or origin, the return path is not wasted. Instead of every hop caching every segment (naive replication: (L+1)·N insertions), segments are striped round-robin across the L intermediate peers, each caches a disjoint 1/L of the batch while the requester keeps the full block for uninterrupted playback.\n\nTotal insertions stay ≤ 2N, redundant storage drops by a factor of ~L, and segment diversity across the overlay is maximized, future requests for any segment in the batch now have a nearby peer source.',
        figure: 'cdn-striping',
        code: `Require: S = {s₀ … s_N₋₁}      // batch of N segments from edge/origin
         P = [p₀ … p_L, p_L]    // reverse P2P return path, p_L = requester

for k = 0 to N−1:
    i ← k mod L                // round-robin across intermediate peers
    pᵢ.CachePut(s_k)           // each hop caches a disjoint subset
    forward s_k toward p_L
p_L.CachePutAll(S)             // requester caches the full batch

⇒ each intermediate peer stores ⌊N/L⌋ or ⌈N/L⌉ segments, no overlap
⇒ total insertions ≤ 2N   vs   (L+1)·N for naive full replication`
      },
      {
        heading: 'Self-organizing topology',
        body: 'Peers form a partial mesh, each maintains 3 to 6 neighbour connections, generated from an adjacency matrix with tunable connection probability p, so the simulator can sweep from sparse overlays to dense meshes. Seed peers connect directly to edge servers and act as content entry points into the mesh.\n\nThe topology is fully dynamic: joins announce themselves to the Tracker and Signalling server; departures simply stop heartbeating and are reaped by Redis TTL expiry. The screenshot below is the live topology dashboard served by the Topology Manager during a 30-peer run.',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/topology-live.png',
            alt: 'Live peer network graph dashboard showing 30 peers and their mesh links',
            caption:
              'Fig 5: 30-peer partial mesh, nodes are peers, edges are neighbour links'
          }
        ],
        bullets: [
          'Partial mesh beats full mesh: O(n²) connections avoided, yet only 2.4 hops on average',
          'Seed peers bridge the mesh to edge servers',
          'Heartbeats every 120 s + Redis TTL: departed peers vanish automatically',
          'Background reaper sweeps expired peers every 30 s; neighbour health probes every 5 s'
        ]
      },
      {
        heading: 'Inside a peer',
        body: 'Each peer is a single static Go binary in a busybox container, 15 MB of RAM including the runtime, built via a multi-stage Dockerfile that shrinks the image 93% (200 MB → 15 MB). It concurrently serves HTTP segment requests, heartbeats the tracker, probes neighbour health, and listens on a WebSocket for computed paths.\n\nThe cache is a mutex-protected LRU over a doubly-linked list + hash map, O(1) hits and evictions. Popular segments pin themselves to the front while cold content ages out.',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/class-peer.png',
            alt: 'Peer node class diagram: peerApp, LRU cache, RTT measurer, tracker and signalling clients',
            caption:
              'Fig 6: Peer node: peerApp orchestrates the LRU cache, RTT measurer, tracker & signalling clients',
            plate: true
          },
          {
            src: '/images/projects/hybrid-p2p-cdn/class-tracker.png',
            alt: 'Tracker service class diagram with Redis client and request/response payloads',
            caption:
              'Fig 7: Tracker service: announce/heartbeat handlers, region-aware lookup, Redis TTL storage',
            plate: true
          }
        ],
        code: `func (l *LRU) Put(seg Segment) {
    l.mu.Lock()
    defer l.mu.Unlock()

    if elem, ok := l.items[seg.ID]; ok {
        l.ll.MoveToFront(elem)          // refresh hot segment
        elem.Value = seg
        return
    }
    if l.ll.Len() >= l.capacity {       // evict coldest, O(1)
        back := l.ll.Back()
        l.ll.Remove(back)
        delete(l.items, back.Value.(Segment).ID)
    }
    l.items[seg.ID] = l.ll.PushFront(seg)
}`
      },
      {
        heading: 'Concurrency in Go',
        body: 'The whole system leans on Go’s M:N scheduler. A peer runs four long-lived goroutines (HTTP server, heartbeat loop, neighbour probe, signalling client) plus one per in-flight request, at 2 KB of stack each, 160 peers cost roughly 640 goroutines and ~1.3 MB of scheduling overhead. Channels carry triggers and computed paths; select statements multiplex timers, triggers, and cancellation in a single loop.',
        images: [
          {
            src: '/images/projects/hybrid-p2p-cdn/goroutines.png',
            alt: 'Diagram of problems goroutines solve: thread management, memory efficiency, concurrency simplicity, blocking I/O',
            caption: 'Fig 8: Why goroutines: ~2 KB stacks vs ~1 MB OS threads',
            plate: true
          }
        ],
        code: `func (a *peerApp) heartbeatLoop(ctx context.Context) {
    ticker := time.NewTicker(a.cfg.HeartbeatInterval)
    defer ticker.Stop()
    for {
        select {
        case <-ctx.Done():
            return                    // context cancelled
        case <-ticker.C:
            a.emitHeartbeat(ctx)      // periodic heartbeat
        case <-a.heartbeatTrg:
            a.emitHeartbeat(ctx)      // triggered after cache change
        }
    }
}`,
        bullets: [
          'sync.Mutex guards the LRU; sync.RWMutex lets topology reads run concurrently',
          'Non-blocking channel sends drop duplicate heartbeat triggers instead of queueing',
          'Context-based cancellation shuts every goroutine down cleanly',
          'go test -race: zero data races across the codebase'
        ]
      },
      {
        heading: 'Routing & peer selection',
        body: 'The Topology Manager answers path queries with plain BFS over the in-memory graph, optimal for hop count, O(V+E), and fast enough (3 ms average) that paths are computed per request. The Tracker ranks candidate sources by a region-aware score before any path is computed, so requests prefer same-region peers with low measured RTT.',
        code: `// Tracker: region-aware candidate scoring
score := 0
if peer.Region == preferredRegion {
    score += 100                     // same region
} else if regionProximity(peer.Region, preferredRegion) {
    score += 50                      // neighbouring region
}
score -= peer.RTT / 10               // RTT penalty (lower is better)
// sort descending, return top 10 candidates`,
        bullets: [
          'BFS: O(V+E) time, O(V) space, shortest hop count on the unweighted overlay',
          'Average path: 2.4 hops (max 5), computed in 3 ms avg, 15 ms max',
          '97% path discovery success under continuous churn',
          'Multi-hop forwarding lets segments traverse intermediate peers when the holder is topologically distant'
        ]
      },
      {
        heading: 'Results',
        body: 'Benchmarked across 30–160 peer deployments against a traditional CDN-only baseline: the peer mesh absorbs 78% of would-be origin traffic,  and average latency nearly halves - while peak capacity 2.5×’s because every new viewer adds serving capacity instead of only demand.',
        figure: 'cdn-comparison',
        bullets: [
          '1,000 concurrent requests over 30 peers: 99.2% success, 68 ms avg, 145 ms p95, 280 ms p99',
          'Cache hits answer in 12 ms vs 85 ms on a miss, 85% faster',
          'Peer startup: 2-3 s per container; 10-20 Mbps per peer during active transfers'
        ]
      },
      {
        heading: 'Fault tolerance & trade-offs',
        body: 'Peer churn is the defining stress: nodes leave without warning. The system detects failures through missed heartbeats and Redis TTL expiry, prunes them from the topology, and degrades gracefully, peer miss -> tracker query -> edge server -> origin, with WebSocket reconnection backing off exponentially. Redundant caching of popular segments across multiple peers removes single points of failure in the data plane.',
        bullets: [
          'Centralized tracker over DHT, simpler and consistent, accepted as a mitigated SPOF (Redis persistence)',
          'Pull over push, peers fetch on demand rather than replicating eagerly, cutting network overhead',
          '120 s heartbeat balances failure-detection speed against chatter',
        ]
      },
      {
        heading: 'Future work',
        body: 'This is a proof-of-concept project; further work will move it toward browser-native, planet-scale operation.',
        bullets: [
          'WebRTC data channels for true browser-to-browser transfer (no local peer process)',
          'Predictive prefetching from playlist position; bandwidth-aware adaptive cache sizing',
          'Prometheus metrics export; Spark streaming for real-time cache/topology analytics; HDFS for historical request logs',
          'Decentralizing the tracker and ML-driven predictive caching to scale to thousands of peers'
        ]
      }
    ],
    links: [
      {
        label: 'HLS - RFC 8216',
        href: 'https://datatracker.ietf.org/doc/html/rfc8216'
      },
      {
        label: 'gorilla/websocket',
        href: 'https://github.com/gorilla/websocket'
      }
    ]
  },

  'read-ai': {
    slug: 'read-ai',
    title: 'Read.AI - Context-Aware Study Assistant',
    tagline:
      'PDFs → vector embeddings → context-aware Q&A with LLAMA, plus auto-generated flashcards and quizzes.',
    role: 'Side Project',
    date: 'Oct 2024 – Jan 2025',
    theme: 'violet',
    overview:
      'An AI-powered study tool that parses PDFs into vector embeddings and enables context-aware Q&A over your own material using a LLAMA model and cosine-similarity search. A dedicated Study Mode turns documents into flashcards and quizzes for exam prep.',
    tags: ['React', 'Node.js', 'Express', 'LLAMA', 'Vector Databases'],
    stats: [
      { label: 'LLM', value: 'LLAMA' },
      { label: 'Retrieval', value: 'Cosine sim' },
      { label: 'Mode', value: 'Study / Q&A' }
    ],
    sections: [
      {
        heading: 'Retrieval-augmented Q&A',
        body: 'PDFs are parsed into vector embeddings stored in a vector database. At query time, cosine-similarity search retrieves the most relevant chunks and feeds them to a LLAMA model for grounded, context-aware answers.',
        bullets: [
          'PDF parsing → chunking → embedding pipeline',
          'Vector database with cosine-similarity retrieval',
          'LLAMA-generated answers grounded in the source document'
        ]
      },
      {
        heading: 'Study Mode',
        body: 'Beyond Q&A, Study Mode auto-generates flashcards and quizzes from the ingested material to make exam preparation active rather than passive.',
        bullets: [
          'Auto-generated flashcards from document content',
          'Quiz generation for self-testing',
          'React front-end over a Node.js / Express backend'
        ]
      }
    ]
  },

  digivote: {
    slug: 'digivote',
    title: 'DigiVote - Decentralized Voting Platform',
    tagline:
      'A DPoS voting blockchain in Go on Tendermint Core: validator elections, vote delegation, multi-option proposals with automatic runoffs, plus an Ethereum smart-contract layer.',
    role: 'Blockchain (CSE542) · Ahmedabad University',
    date: 'Jan - Apr 2025',
    theme: 'amber',
    overview:
      'Traditional voting systems suffer from vote tampering, opacity, and centralized control - and even real blockchain voting pilots like Voatz were shown by MIT researchers to have serious vulnerabilities. DigiVote is a decentralized voting platform built as a deterministic state machine in Go on top of Tendermint Core via ABCI, using Delegated Proof-of-Stake consensus. Every action - registering users, electing validators, delegating votes, creating proposals, casting weighted votes - is an on-chain transaction, with SHA-256 app-hashes committed every block. A parallel Ethereum layer (Solidity contracts deployed via Truffle) mirrors elections and stake-weighted delegation, bridged from Go through go-ethereum.\n\n',
    tags: [
      'Go',
      'Tendermint',
      'ABCI',
      'Solidity',
      'Ethereum',
      'go-ethereum',
      'Truffle',
      'Bubble Tea'
    ],
    stats: [
      { label: 'Consensus', value: 'DPoS' },
      { label: 'Validators elected per cycle', value: '3' },
      { label: 'On-chain transaction types', value: '7' }
    ],
    sections: [
      {
        heading: 'Why DPoS',
        body: 'Proof-of-Work is computationally wasteful and too slow for voting workloads that need real-time responsiveness. Delegated Proof-of-Stake, pioneered by BitShares and EOS, lets stakeholders elect a small validator set responsible for block production, trading raw decentralization for throughput and energy efficiency. DigiVote embeds that model directly in the application layer: governance rules live in Go code interfaced to Tendermint through ABCI, not in smart contracts, so the consensus engine handles BFT ordering while the app owns all voting logic deterministically.'
      },
      {
        heading: 'Architecture',
        body: 'The DPoS application serves it to Tendermint Core over an ABCI socket server, while a Bubble Tea terminal dashboard renders live state in the same process. Tendermint drives the block lifecycle : CheckTx validation, DeliverTx execution, and Commit, which serializes the full application state and SHA-256 hashes it into the app-hash so every node can verify state agreement.',
        bullets: [
          'DPoSApplication implements the full ABCI interface: CheckTx, DeliverTx, BeginBlock, EndBlock, Commit, Query',
          'Application state tracks users/validators, proposals, the active validator set, and last block height + hash',
          '7 transaction types: add_user, vote_validator, elect_validators_by_vote, delegate_vote, undelegate_vote, create_proposal, vote_proposal',
          'Mutex-protected internal action queue carries decisions from EndBlock into the next BeginBlock',
          'PowerShell simulation suite drives the whole system end-to-end through Tendermint RPC (broadcast_tx_commit + abci_query)'
        ]
      },
      {
        heading: 'Validator elections',
        body: 'Users register on-chain as validator candidates and vote for each other; an election transaction then deterministically sorts candidates by votes received (address as tie-breaker, so every node computes the identical result) and promotes the top K = 3 to the active set. Vote counts reset each cycle and non-elected candidates are marked inactive, the status updates and resets fan out across goroutines with a WaitGroup, keeping the deterministic sort sequential while parallelizing the bookkeeping.',
        code: 'candidate pool → vote_validator txs → elect_validators_by_vote\n  sort by VotesReceived desc (addr tie-break)   · deterministic\n  top-3 → status "active"                       · new validator set\n  rest  → status "inactive", votes reset to 0   · parallel goroutines\n  cycle repeats, everyone re-enters the pool'
      },
      {
        heading: 'Delegation & weighted voting',
        body: 'Every user starts with 1 unit of voting power. Delegating hands it to another user: the delegator drops to zero and can no longer vote directly, the delegatee’s power grows, and undelegating reverses the transfer at any time. Proposal votes are weighted by the voter’s current power, so a delegate voting on behalf of five people moves the tally by six.',
        bullets: [
          'Voting power = 1 base + delegated power, recalculated on every (un)delegation',
          'One delegation at a time; self-delegation and double delegation rejected at execution',
          'Delegating users are blocked from voting directly until they undelegate',
          'Vote reversibility, undelegate restores base power immediately'
        ]
      },
      {
        heading: 'Proposal lifecycle & automatic runoffs',
        body: 'Proposals are multi-option (minimum two) with a 24-hour voting window. At EndBlock the app scans for expired proposals and tallies them; the resulting action is queued and executed in the next BeginBlock, keeping state transitions inside the block lifecycle. A clear leader completes the proposal with its winner recorded on-chain, a tie automatically spawns a runoff proposal restricted to the tied options, linked to its parent by ID.',
        code: 'created → active → (24 h voting) → expired\nEndBlock: tally + tie detection → queue action\nBeginBlock (next block):\n  single leader → completed, winner recorded\n  tie           → parent marked runoff_required,\n                  child runoff proposal created (tied options only)\n  no votes      → completed, "(No Votes)"'
      },
      {
        heading: 'Ethereum layer',
        body: 'Two Solidity contracts mirror the governance model on Ethereum, deployed with Truffle against Ganache. ElectionManager runs registered-voter elections, owner-gated voter registration, time-windowed voting, one vote per voter enforced by a hasVoted map, and per-candidate result queries. DelegatedVoting implements the stake side: users stake Ether, delegate to validators, cast stake-weighted validator votes, and the contract tracks a top-3 leaderboard. An EthereumBridge in Go (go-ethereum ethclient) scaffolds cross-chain sync of votes, validators, and proposals between the Tendermint app and the contracts.',
        bullets: [
          'ElectionManager.sol, voter registry, timed elections, double-vote prevention, on-chain results',
          'DelegatedVoting.sol, ETH staking, delegation mapping, stake-weighted votes, top-3 validator tracking, stake withdrawal',
          'Truffle migrations + Ganache for local deployment and testing'
        ]
      },
      {
        heading: 'Live dashboard',
        body: 'A Bubble Tea TUI (with Lip Gloss styling and a scrollable viewport) polls application state every 3 seconds and renders the network at a glance: totals for users, active validators and proposals, the elected validator set with votes and power, the full validator pool with delegation arrows, and each proposal’s status with its current leading option and vote power.',
        bullets: [
          'Overview, active validators, validator pool, and proposals sections',
          'Delegation relationships rendered inline (who → whom)',
          'Winner-so-far per proposal computed live from the vote map'
        ]
      }
    ]
  },

  'vehicle-stop-classifier': {
    slug: 'vehicle-stop-classifier',
    title: 'Identifying Hard Stop & Momentary Stop from Trajectories',
    tagline:
      'Classifying vehicle behaviour at intersections from aerial-view trajectory data for traffic analysis and road safety.',
    role: 'Research · Ahmedabad University',
    date: 'Jan – Apr 2025',
    theme: 'slate',
    overview:
      'A machine-learning pipeline that classifies vehicle behaviour at intersections into moving, momentary stop, and hard stop using aerial-view trajectory datasets. Built for traffic analysis and road-safety studies, it generalises across varied environmental and sampling conditions.',
    tags: [
      'Python',
      'scikit-learn',
      'Random Forest',
      'K-Means',
      'HMM',
      'pandas',
      'NumPy'
    ],
    stats: [
      { label: 'Classes', value: '3 behaviours' },
      { label: 'Data', value: 'Aerial trajectories' },
      { label: 'Models', value: 'RF · K-Means · HMM' }
    ],
    sections: [
      {
        heading: 'Approach',
        body: 'Aerial-view trajectory data is processed into motion features, then classified into moving, momentary stop, and hard stop. A mix of Random Forest, K-Means, and Hidden Markov Models captures both static behaviour and temporal state transitions.',
        bullets: [
          'Feature engineering from raw trajectory sequences',
          'Random Forest classification with K-Means and HMM components',
          'pandas / NumPy / matplotlib data pipeline'
        ]
      },
      {
        heading: 'Generalisation',
        body: 'The system was tested on multiple collected datasets and demonstrated strong generalization across varied environmental and sampling conditions, a key requirement for real-world traffic monitoring.',
        bullets: [
          'Validated on multiple independently collected datasets',
          'Robust across environmental and sampling variation',
          'Aimed at intersection traffic analysis and road safety'
        ]
      }
    ]
  },

  'advanced-aes': {
    slug: 'advanced-aes',
    title: 'Advanced Rijndael / AES Encryption System',
    tagline:
      'A robust AES implementation in C++, 128/192/256-bit keys, ECB/CBC/CTR modes, thread-safe operations.',
    role: 'Systems · Ahmedabad University',
    date: 'Aug – Nov 2023',
    theme: 'blue',
    overview:
      'A from-scratch AES (Rijndael) encryption system in C++ supporting 128/192/256-bit keys and ECB, CBC, and CTR modes. It implements the core AES transformations with secure key generation and thread-safe operation for reliable data encryption.',
    tags: ['C++', 'STL', 'Threading', 'Linear Algebra'],
    stats: [
      { label: 'Key sizes', value: '128/192/256' },
      { label: 'Modes', value: 'ECB · CBC · CTR' },
      { label: 'Language', value: 'C++' }
    ],
    sections: [
      {
        heading: 'Core cipher',
        body: 'Implemented the full AES round structure, SubBytes, ShiftRows, MixColumns, and AddRoundKey, over GF(2⁸), driven by secure key expansion for all three key lengths.',
        bullets: [
          'SubBytes / ShiftRows / MixColumns / AddRoundKey from first principles',
          'Key expansion for 128-, 192-, and 256-bit keys',
          'Finite-field (GF(2⁸)) arithmetic underpinning MixColumns'
        ]
      },
      {
        heading: 'Modes & safety',
        body: 'Supports ECB, CBC, and CTR modes of operation with secure key generation and thread-safe operations for concurrent workloads.',
        bullets: [
          'ECB / CBC / CTR block modes',
          'Secure key generation',
          'Thread-safe operations using the C++ STL'
        ]
      }
    ]
  },

  'facial-detection': {
    slug: 'facial-detection',
    title: 'Facial Detection Using Image Segmentation',
    tagline:
      'A custom face + feature detector using skin-tone colour segmentation and k-means clustering in LAB colour space.',
    role: 'Computer Vision · Ahmedabad University',
    date: 'Aug – Nov 2023',
    theme: 'emerald',
    overview:
      'A custom MATLAB algorithm that detects human faces and features in images through colour segmentation. It isolates facial regions, eyes, nose, mouth, via skin-tone clustering, and extracts features using k-means clustering in LAB colour space.',
    tags: [
      'MATLAB',
      'Image Segmentation',
      'Image Processing',
      'Computer Vision'
    ],
    stats: [
      { label: 'Colour space', value: 'LAB' },
      { label: 'Method', value: 'K-Means' },
      { label: 'Tool', value: 'MATLAB' }
    ],
    sections: [
      {
        heading: 'Skin-tone segmentation',
        body: 'The algorithm segments images by skin tone to isolate candidate facial regions, then localises features such as eyes, nose, and mouth within those regions.',
        bullets: [
          'Colour segmentation to isolate skin regions',
          'Facial region localisation (eyes, nose, mouth)',
          'Custom detection algorithm rather than an off-the-shelf model'
        ]
      },
      {
        heading: 'Feature extraction',
        body: 'Facial feature extraction is achieved with k-means clustering in LAB colour space, which separates perceptually distinct regions more reliably than RGB.',
        bullets: [
          'K-means clustering in LAB colour space',
          'Perceptually-motivated colour separation',
          'Applied to facial feature extraction and computer-vision analysis'
        ]
      }
    ]
  }
};

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return projectDetails[slug];
}

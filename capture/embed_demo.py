#!/usr/bin/env python3
"""
Screen-capture demo for the "two sentences, no shared words" video.

Produces the three shots that carry the film, using a real open-weight model
running locally — no API key, no account, nothing sent anywhere. That matters
twice over: it is genuinely honest footage, and it is the same open-source
stack the course is about.

    pip install sentence-transformers matplotlib
    python3 embed_demo.py numbers      # shot 3+4 — the sentences become numbers
    python3 embed_demo.py compare      # shot 5   — the two lists sit side by side
    python3 embed_demo.py map          # shot 6   — writes meaning_map.png

Film the terminal full-screen, dark background, large font (18-20pt).
Everything prints slowly on purpose: it is paced to be filmed, not read.
"""

import sys
import time

A = "How do I reset my password?"
B = "I can't log into my account."
FAR = "What time does the restaurant open?"

# A small corpus for the map shot. Three clusters that a human can see are
# three topics, so the picture explains itself before anyone reads a word.
CORPUS = [
    # account / access
    "How do I reset my password?", "I can't log into my account.",
    "Forgotten my login details.", "My account is locked out.",
    "The sign-in page keeps rejecting me.", "How do I change my email address?",
    "Two-factor code never arrives.", "I need to recover my username.",
    # billing
    "When will I be charged?", "How do I cancel my subscription?",
    "Can I get a refund?", "My card was declined.",
    "Where is my invoice?", "Do you offer annual billing?",
    "I was billed twice this month.", "How do I update my payment card?",
    # opening hours / location
    "What time does the restaurant open?", "Are you open on Sundays?",
    "What are your opening hours?", "Where exactly are you located?",
    "Is there parking nearby?", "How late do you serve food?",
    "Do you open on bank holidays?", "Which floor are you on?",
]

SLOW = 0.045


def type_out(text, delay=SLOW, end="\n"):
    for ch in text:
        sys.stdout.write(ch)
        sys.stdout.flush()
        time.sleep(delay)
    sys.stdout.write(end)
    sys.stdout.flush()


def rule(char="─", width=64):
    print(char * width)


def load():
    from sentence_transformers import SentenceTransformer
    print()
    type_out("loading model … (offline, on this machine)", 0.02)
    m = SentenceTransformer("all-MiniLM-L6-v2")
    print()
    return m


def show_vector(vec, per_line=6, lines=4):
    """Print the head of a vector in a wide, filmable grid."""
    flat = [f"{v: .4f}" for v in vec[: per_line * lines]]
    for i in range(0, len(flat), per_line):
        print("   " + "  ".join(flat[i : i + per_line]))
        time.sleep(0.12)
    print(f"   …  {len(vec)} numbers in total")


def cmd_numbers(model):
    for sentence in (A, B):
        rule()
        type_out(f'  "{sentence}"')
        rule()
        time.sleep(0.4)
        vec = model.encode(sentence)
        show_vector(vec)
        print()
        time.sleep(0.8)


def cmd_compare(model):
    import numpy as np

    va, vb, vf = (model.encode(s) for s in (A, B, FAR))

    def cos(x, y):
        return float(x @ y / (np.linalg.norm(x) * np.linalg.norm(y)))

    rule("═")
    print(f'  "{A}"')
    print(f'  "{B}"')
    rule("═")
    print()
    time.sleep(0.6)
    type_out("  words in common . . . . . . . . . . .  0", 0.03)
    time.sleep(0.9)
    type_out(f"  closeness in meaning  . . . . . . . .  {cos(va, vb):.2f}", 0.03)
    print()
    time.sleep(1.2)
    rule()
    print(f'  against "{FAR}"')
    rule()
    time.sleep(0.5)
    type_out(f"  closeness in meaning  . . . . . . . .  {cos(va, vf):.2f}", 0.03)
    print()


def cmd_map(model):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import numpy as np
    from sklearn.decomposition import PCA

    vecs = model.encode(CORPUS)
    pca = PCA(n_components=2).fit(vecs)
    pts = pca.transform(vecs)

    query = model.encode(A)
    qxy = pca.transform([query])[0]

    sims = vecs @ query / (np.linalg.norm(vecs, axis=1) * np.linalg.norm(query))
    near = np.argsort(-sims)[:5]

    fig, ax = plt.subplots(figsize=(9, 16), dpi=120)
    fig.patch.set_facecolor("#0d1117")
    ax.set_facecolor("#0d1117")

    ax.scatter(pts[:, 0], pts[:, 1], s=260, c="#3d4450", edgecolors="none", zorder=2)
    ax.scatter(
        pts[near, 0], pts[near, 1], s=420, c="#ff5c3a", edgecolors="none", zorder=3
    )
    for i in near:
        ax.plot(
            [qxy[0], pts[i, 0]], [qxy[1], pts[i, 1]],
            c="#ff5c3a", lw=1.6, alpha=0.55, zorder=1,
        )
    ax.scatter(
        [qxy[0]], [qxy[1]], s=900, c="#ffffff", edgecolors="#ff5c3a",
        linewidths=3, zorder=4,
    )

    ax.set_xticks([]); ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)
    fig.tight_layout(pad=0)
    fig.savefig("meaning_map.png", facecolor=fig.get_facecolor())
    print("\n  wrote meaning_map.png")
    print("  white dot = the question · coral = its five nearest in meaning\n")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "numbers"
    m = load()
    {"numbers": cmd_numbers, "compare": cmd_compare, "map": cmd_map}[cmd](m)

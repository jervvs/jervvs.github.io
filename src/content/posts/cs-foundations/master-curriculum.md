---
title: "The Multi-Domain Engineer's Master Curriculum"
date: 2026-07-12
description: "A six-volume, ground-up textbook blueprint across Python, Linux, SQL/Data, SRE, IT Ops, and Finance — the plan CS Foundations is built from."
draft: true
series: "cs-foundations"
order: 4
tags: ["learning", "cs-foundations", "curriculum"]
---

## TL;DR
- **This is a complete, six-volume textbook architecture** that sequences every requested concept shallow-to-deep across Python, Linux/Bash, SQL/Data Engineering, SRE/Production Support, IT Operations/Endpoint Engineering, and Finance/Trading — each track a self-contained "textbook" of chapters with objectives, subtopics, hands-on labs, curated canonical resources, and explicit cross-track prerequisites.
- **The tracks interlock through a dependency graph**: Python + Linux are the parallel foundation; SQL/Data Engineering builds on both; SRE and IT Operations build on all three; and Finance/Trading is the contextual thread woven throughout, becoming essential the moment the engineer touches real market data.
- **Resources are anchored to canonical primary sources** — *Fluent Python*, *The Linux Command Line*, *The Linux Programming Interface*, *Systems Performance*, *Designing Data-Intensive Applications*, *The Data Warehouse Toolkit*, Google's *SRE*/*SRE Workbook*, *Trading and Exchanges*, Michael Simmons' *Securities Operations* and *Corporate Actions* — plus official documentation and industry standards (ISO 6166, ANSI X9.145, SWIFT ISO 15022/20022, DTCC).

---

## Key Findings

**The curriculum is buildable today from authoritative material.** Every track maps to at least one canonical, still-current textbook and a body of official documentation, so an author can expand each module into a chapter without inventing scaffolding.

**The finance/trading track is the differentiator and the hardest to source generically.** The genuinely specialized knowledge an engineer needs — the reconciliation hierarchy (trade → position → cash → P&L → NAV), corporate-action adjustment, security-master identifier mapping, and point-in-time data to avoid look-ahead bias — is concentrated in a small set of practitioner texts (Simmons; Harris) and industry standards (ISO/SWIFT/DTCC) rather than mainstream tech books. Track 6 therefore carries a dedicated deep reconciliation/data-quality module (6.13) that ties the domain back to the general data-engineering tracks.

**Several technical facts must be stated with current precision** (integrated below): CPython 3.13 (released October 7, 2024) shipped the first experimental free-threaded/no-GIL build under PEP 703, and PEP 779 made it "officially supported but still optional" in Python 3.14; the US moved to a **T+1** settlement cycle with an SEC compliance date of **May 28, 2024** (amended Rule 15c6-1(a)); and FIGI (ANSI X9.145-2021) is designed so its identifier "never changes as a result of any corporate action," unlike an ISIN, which does.

---

## Details

### Introduction: How the Six Tracks Fit Together

This blueprint is the skeleton of a six-volume textbook designed to take a motivated engineer from absolute beginner to deep expert across the full stack of skills needed to support a modern trading/financial-services research and operations environment. Each track is self-contained and sequenced shallow-to-deep, but they interlock.

**Suggested learning order / dependency graph:**
- **Foundation layer (parallel):** Track 1 (Python) and Track 2 (Linux + Bash) are started together. They are the substrate for everything else.
- **Data layer:** Track 3 (SQL + Data Engineering) builds directly on Python (Track 1, for pandas/SQLAlchemy) and Linux (Track 2, for pipeline orchestration and cron).
- **Reliability layer:** Track 4 (SRE) builds on Linux (Track 2), Python (Track 1, for automation), and Data Engineering (Track 3, for pipeline oversight).
- **Operations layer:** Track 5 (IT Ops & Endpoint) draws on Linux (Track 2), Python (Track 1, for automation), and Git/CI-CD, and shares identity/directory concepts with Track 4.
- **Domain layer (parallel, ongoing):** Track 6 (Finance & Trading) is the contextual "why" and can be read in parallel from day one; it becomes essential once the engineer touches real market data in Tracks 3 and 4.

A reasonable full progression: **1 & 2 together → 3 → 4 → 5 → 6 woven throughout**, with Track 6 Chapters 1–3 read early for orientation.

---

## TRACK 1 — PYTHON (for Automation and Data Engineering)

**Track goal:** From "never written code" to CPython-internals-level fluency, with an automation and data-manipulation bias.

**Anchor resources:** *Python Crash Course, 3rd ed.* (Eric Matthes, No Starch) for beginners; *Fluent Python, 2nd ed.* (Luciano Ramalho, O'Reilly, 2022) — organized as five parts, with Part V covering concurrency — as the intermediate-to-advanced spine; the official Python Tutorial and Language Reference (docs.python.org); *Automate the Boring Stuff with Python* (Al Sweigart) for scripting motivation; *Effective Python, 2nd ed.* (Brett Slatkin) for idioms; *CPython Internals* (Anthony Shaw) for the deep end.

### Module 1.1 — Getting Started & Language Fundamentals
- **Objectives:** Install Python, run scripts and the REPL, understand the execution model.
- **Concepts:** Interpreter vs. script; the REPL; `python -m`; syntax basics; variables and dynamic typing; numbers, strings, booleans; operators; comments; PEP 8 style; string formatting (f-strings).
- **Labs:** Build a temperature converter and a simple-interest calculator CLI.
- **Resources:** *Python Crash Course* Ch. 1–2; official Python Tutorial §1–3.

### Module 1.2 — Core Data Types & Data Structures
- **Objectives:** Master the built-in containers and when to use each.
- **Concepts:** Lists, tuples, dicts, sets, frozensets; mutability vs. immutability; sequence slicing; dict/set internals conceptually; string methods; bytes vs. str and Unicode.
- **Labs:** Word-frequency counter; nested-dict record manipulation.
- **Resources:** *Fluent Python* Part I (Ch. 1–4: Data Model, Sequences, Dicts/Sets, Unicode).
- **Cross-ref:** Prereq for Track 3 pandas work.

### Module 1.3 — Control Flow & Functions
- **Objectives:** Write structured, reusable code.
- **Concepts:** `if/elif/else`; `for`/`while`; loop `else`; structural pattern matching (`match`); function definitions; positional/keyword/positional-only/keyword-only params; `*args`/`**kwargs`; the mutable-default pitfall; scope (LEGB); closures.
- **Labs:** FizzBuzz variants; a retry-with-backoff function.
- **Resources:** *Fluent Python* Ch. 7 (Functions as First-Class Objects); official Tutorial §4.

### Module 1.4 — Modules, Packages, Virtual Environments & Dependency Management
- **Objectives:** Organize code and manage dependencies reproducibly.
- **Concepts:** `import` system; modules vs. packages; `__init__.py`; `__main__`; `sys.path`; virtual environments; `pip`, `venv`; `pyproject.toml`; `poetry`; `uv` (fast modern resolver/installer from Astral); lockfiles; semantic versioning.
- **Labs:** Package a multi-module project; reproduce an environment from a lockfile with both Poetry and uv.
- **Resources:** Official Python Packaging User Guide (packaging.python.org); Poetry docs; uv docs.

### Module 1.5 — Object-Oriented Programming
- **Objectives:** Model domains with classes; understand Python's object model.
- **Concepts:** Classes/instances/attributes/methods; `self`; class vs. instance attributes; inheritance, composition, mixins; MRO and `super()`; dunder/special methods; `@property`; `@classmethod`/`@staticmethod`; dataclasses; `__slots__`; abstract base classes; protocols (structural typing).
- **Labs:** Build a `Money`/`Portfolio` class hierarchy with operator overloading.
- **Resources:** *Fluent Python* Part III (Object-Oriented Idioms); official `dataclasses`/`abc` docs.
- **Cross-ref:** Ties to Track 6 domain modeling.

### Module 1.6 — Functional Idioms, Comprehensions, Iterators & Generators
- **Objectives:** Write Pythonic, lazy, memory-efficient transformations.
- **Concepts:** List/dict/set comprehensions; generator expressions; `map`/`filter`/`reduce`; `lambda`; `functools` (`partial`, `reduce`, `lru_cache`, `singledispatch`); iterator protocol; generators and `yield`/`yield from`; `itertools` deep-dive.
- **Labs:** Streaming CSV row transformer with generators; sliding-window iterator.
- **Resources:** *Fluent Python* Ch. 17; official `itertools`/`functools` docs.

### Module 1.7 — Decorators & Context Managers
- **Objectives:** Master metaprogramming building blocks used across frameworks.
- **Concepts:** Closures recap; decorators (function and class); `functools.wraps`; parameterized decorators; context managers (`with`, `__enter__`/`__exit__`); `contextlib` (`contextmanager`, `ExitStack`, `suppress`).
- **Labs:** Timing decorator and a transactional-file context manager.
- **Resources:** *Fluent Python* Ch. 9; official `contextlib` docs.

### Module 1.8 — Error Handling & Robustness
- **Objectives:** Handle failure deliberately.
- **Concepts:** Exception hierarchy; `try/except/else/finally`; raising and chaining (`raise ... from`); custom exceptions; exception groups (`except*`); EAFP vs. LBYL; warnings.
- **Labs:** Add layered error handling to the retry function.
- **Resources:** Official Tutorial §8; *Effective Python* exception items.

### Module 1.9 — Typing & Type Hints
- **Objectives:** Add static guarantees to dynamic code.
- **Concepts:** `typing`; annotations; `Optional`, `Union`/`|`, `Literal`, `TypedDict`, `Protocol`, generics, `TypeVar`; `mypy`; runtime validation with `pydantic`.
- **Labs:** Annotate a codebase to pass `mypy --strict`.
- **Resources:** *Fluent Python* Ch. 8, 13–15; mypy docs; official `typing` docs.

### Module 1.10 — Standard Library Deep-Dive
- **Objectives:** Know the batteries that ship with Python.
- **Concepts:** `os`, `sys`, `pathlib`, `subprocess`; `collections` (`defaultdict`, `Counter`, `deque`, `namedtuple`); `datetime`/`zoneinfo`; `logging` (handlers, formatters, levels, structured logging); `argparse`; `json`, `csv`; `re`.
- **Labs:** Log-parsing utility combining `pathlib`, `re`, and `Counter`.
- **Resources:** Official Standard Library docs; Doug Hellmann's PyMOTW.
- **Cross-ref:** `subprocess`/`os` connect to Track 2; `logging` to Track 4.

### Module 1.11 — File I/O, Serialization & Regular Expressions
- **Objectives:** Read/write every common format.
- **Concepts:** Text vs. binary I/O; encodings; buffering; `json`, `csv`, `pickle`, `configparser`, `tomllib`; regex syntax, groups, lookahead/behind, compiled patterns.
- **Labs:** Regex-based extractor over a directory tree.
- **Resources:** Official `io`/`re` docs; regex101.com.

### Module 1.12 — Concurrency & Parallelism
- **Objectives:** Understand and choose the right concurrency model.
- **Concepts:** Processes vs. threads vs. coroutines; the GIL (only one thread executes Python bytecode at a time, so threading helps I/O-bound but not CPU-bound work) and its real impact; `threading`; `multiprocessing`; `concurrent.futures`; `asyncio` (event loop, `async`/`await`, tasks, `gather`); I/O-bound vs. CPU-bound. **Current context:** CPython 3.13 (released October 7, 2024) shipped the first experimental free-threaded (no-GIL) build under PEP 703 (accepted by the Steering Council Oct 24, 2023); PEP 779 made it "officially supported but still optional" in Python 3.14.
- **Labs:** Download many URLs three ways (threads, processes, asyncio) and benchmark; parallel prime checker.
- **Resources:** *Fluent Python* Part V (Ch. 19–21); official `asyncio` docs; PEP 703 / PEP 779.

### Module 1.13 — Testing, Debugging & Quality
- **Objectives:** Ship trustworthy, maintainable code.
- **Concepts:** `unittest` vs. `pytest`; fixtures; parametrization; mocking (`unittest.mock`, `monkeypatch`); coverage (`coverage.py`); property-based testing (`hypothesis`); debugging with `pdb`/`ipdb`; linters/formatters (`ruff`, `black`, `flake8`).
- **Labs:** 90%+ coverage on the log-parser; add a hypothesis test.
- **Resources:** pytest docs; *Python Testing with pytest* (Brian Okken); `unittest.mock` docs.

### Module 1.14 — Packaging, Distribution & CLI Tooling
- **Objectives:** Turn code into installable tools.
- **Concepts:** `pyproject.toml` build backends; wheels vs. sdists; entry points/console scripts; publishing to PyPI; `click` and `typer`; rich terminal output (`rich`).
- **Labs:** Publish a `typer` CLI to TestPyPI.
- **Resources:** Packaging User Guide; Typer/Click docs.
- **Cross-ref:** Track 5 IT automation and Track 4 toil reduction consume these.

### Module 1.15 — Performance, Profiling & CPython Internals
- **Objectives:** Diagnose and fix slow/memory-heavy Python.
- **Concepts:** `timeit`; `cProfile`; `line_profiler`; `memory_profiler`; `tracemalloc`; big-O intuition; bytecode (`dis`); reference counting and GC; object model/memory layout; C extensions and Cython at a high level.
- **Labs:** Profile and 10× a naive data-processing script.
- **Resources:** *High Performance Python* (Gorelick & Ozsvald); *CPython Internals* (Anthony Shaw); official `profile`/`gc` docs.

### Module 1.16 — The Modern Python Data Stack (Capstone)
- **Objectives:** Manipulate real datasets at scale.
- **Concepts:** **NumPy** (ndarray, vectorization, broadcasting); **pandas** deep-dive (Series/DataFrame, indexing, `groupby`, joins, reshaping, time series, method chaining, performance pitfalls); **Polars** (lazy API, expressions); **PyArrow** and the Arrow format; **DuckDB** (in-process OLAP SQL on files); **SQLAlchemy** (Core and ORM); **requests**/**httpx**; **pydantic** for validation/models.
- **Labs:** End-to-end pipeline: httpx API pull → pydantic validation → pandas/Polars transform → DuckDB query → SQLAlchemy persist → PyArrow Parquet write.
- **Resources:** *Python for Data Analysis, 3rd ed.* (Wes McKinney); official NumPy, Polars, DuckDB, PyArrow, SQLAlchemy, pydantic docs.
- **Cross-ref:** Directly feeds Track 3 and Track 6.

---

## TRACK 2 — LINUX + BASH

**Track goal:** From "what is a terminal" to reading kernel-level performance metrics under production pressure.

**Anchor resources:** *The Linux Command Line, 3rd ed.* (William Shotts, No Starch — also free at linuxcommand.org); *The Linux Programming Interface* (Michael Kerrisk) for system-call depth; *How Linux Works, 3rd ed.* (Brian Ward); *Systems Performance, 2nd ed.* (Brendan Gregg, Addison-Wesley, 2020); the GNU Bash Reference Manual.

### Module 2.1 — Orientation & the Filesystem Hierarchy
- **Concepts:** What the shell is; terminal vs. shell vs. console; the FHS (`/`, `/etc`, `/var`, `/usr`, `/home`, `/proc`, `/sys`, `/dev`); absolute vs. relative paths; `pwd`, `cd`, `ls`, `tree`; man pages.
- **Labs:** Map the FHS on a live system.
- **Resources:** *TLCL* Part I (Ch. 1–3); FHS spec.

### Module 2.2 — File & Directory Manipulation
- **Concepts:** `cp`, `mv`, `rm`, `mkdir`, `touch`, `ln` (hard vs. symbolic); globbing; `less`/`cat`/`head`/`tail`; `file`, `stat`; archiving (`tar`, `gzip`, `zip`).
- **Labs:** Build and restore a compressed backup tree.
- **Resources:** *TLCL* Ch. 4–5.

### Module 2.3 — Text Processing & the Unix Pipeline
- **Concepts:** `grep` (regex), `sed`, `awk`, `cut`, `sort`, `uniq`, `tr`, `wc`, `find`, `xargs`; pipes; redirection (`>`, `>>`, `<`, `2>`, `&>`); here-docs/here-strings; process substitution; `tee`.
- **Labs:** Top-10 IPs in an access log; awk column aggregation.
- **Resources:** *TLCL* Ch. 6–7, 19–20; *sed & awk* (Dougherty & Robbins).
- **Cross-ref:** Complements Track 1 Module 1.10 — teach when to use each.

### Module 2.4 — Permissions, Users & Groups
- **Concepts:** Users/groups/ownership; `chmod` (symbolic/octal), `chown`, `chgrp`; permission triad; setuid/setgid/sticky; umask; `sudo`/`sudoers`; `/etc/passwd`, `/etc/shadow`, `/etc/group`; ACLs (`getfacl`/`setfacl`).
- **Labs:** Shared group directory with correct setgid behavior.
- **Resources:** *TLCL* Ch. 9; *How Linux Works* Ch. 7.

### Module 2.5 — Processes, Signals & Job Control
- **Concepts:** Process model, PIDs, fork/exec; `ps`, `pgrep`, `pstree`; foreground/background, `&`, `jobs`, `fg`/`bg`, `nohup`, `disown`; signals (`SIGTERM`, `SIGKILL`, `SIGHUP`, `SIGINT`) and `kill`/`killall`; process states; nice/renice.
- **Labs:** Trap and handle signals in a long-running script.
- **Resources:** *TLCL* Ch. 10; *The Linux Programming Interface* Ch. 20–22 (signals).

### Module 2.6 — Shell Environment & Configuration
- **Concepts:** Environment vs. shell variables; `export`; `.bashrc` vs. `.bash_profile` vs. `/etc/profile`; `PATH`; aliases/functions; prompt (`PS1`); startup sequence; login vs. non-login, interactive vs. non-interactive.
- **Labs:** Portable dotfiles setup.
- **Resources:** *TLCL* Ch. 11–13.

### Module 2.7 — Bash Scripting: Fundamentals
- **Concepts:** Shebang; variables and quoting; command substitution `$(...)`; arithmetic `$((...))`; conditionals (`test`, `[`, `[[`); `if`/`case`; loops (`for`, `while`, `until`); reading input; exit codes.
- **Labs:** Backup-rotation script with argument parsing.
- **Resources:** *TLCL* Part IV; Bash Reference Manual.

### Module 2.8 — Bash Scripting: Advanced & Robust
- **Concepts:** Functions; indexed/associative arrays; parameter expansion (defaults, substrings, replacement, case conversion); `getopts`; `trap` and cleanup; `set -euo pipefail`; error handling; debugging (`set -x`, `bash -n`, `shellcheck`); here-doc templating.
- **Labs:** Rewrite the backup script defensively (shellcheck-clean, traps, `set -euo pipefail`).
- **Resources:** *TLCL* Ch. 25–36; ShellCheck; Google Shell Style Guide.
- **Cross-ref:** Track 4 toil reduction and Track 5 IT automation build on this.

### Module 2.9 — Package Management & Software Installation
- **Concepts:** `apt`/`dpkg`; `dnf`/`yum`/`rpm`; repositories and GPG keys; dependency resolution; build from source; Snap/Flatpak; version pinning.
- **Labs:** Install, hold, and remove packages; add a third-party repo safely.
- **Resources:** *TLCL* Ch. 14; Debian Handbook; Red Hat docs.

### Module 2.10 — systemd & Service Management
- **Concepts:** init history; `systemd` units (service, socket, timer, target); `systemctl`; unit anatomy; enable vs. start; dependencies/ordering; `journalctl`; timers vs. cron.
- **Labs:** systemd service + timer running a Python job.
- **Resources:** systemd docs (freedesktop.org); *How Linux Works* Ch. 6.

### Module 2.11 — Scheduling: cron & Beyond
- **Concepts:** `cron`, crontab syntax, `/etc/cron.d`; `anacron`; `at`; systemd timers; cron environment gotchas; logging output.
- **Labs:** Schedule and monitor a data pull with log rotation.
- **Resources:** `man 5 crontab`; distro cron docs.
- **Cross-ref:** Track 3 orchestration builds on scheduling.

### Module 2.12 — Networking from the Command Line
- **Concepts:** TCP/IP and OSI refresher; `ip` (addr/route/link), `ifconfig`/`route`; `ss`/`netstat`; `ping`, `traceroute`, `mtr`; DNS (`dig`/`nslookup`/`host`); `curl`/`wget`; ports/sockets; `tcpdump` basics; `iptables`/`nftables`; SSH (keys, config, tunneling).
- **Labs:** Diagnose a "service unreachable" scenario end-to-end; read a packet trace.
- **Resources:** *TLCL* Ch. 16; *How Linux Works* Ch. 9–10; Julia Evans' networking zines.

### Module 2.13 — Logs, journald & CLI Observability
- **Concepts:** `/var/log` layout; `journalctl` filtering; `rsyslog`/`syslog`; `logrotate`; `dmesg`; following logs (`tail -f`, `less +F`); structured inspection with `jq`.
- **Labs:** Trace an application failure across journald and app logs.
- **Resources:** systemd-journald docs; `jq` manual.
- **Cross-ref:** Feeds Track 4 (logs pillar).

### Module 2.14 — System Troubleshooting Methodology
- **Objectives:** Systematically find CPU/memory/disk/network bottlenecks.
- **Concepts:** The USE Method (Utilization, Saturation, Errors for every resource); `top`/`htop`, `vmstat`, `iostat`, `free`, `df`, `du`, `lsof`, `sar`, `mpstat`, `pidstat`; load average; OOM killer; swap; disk I/O saturation; `strace`/`ltrace`.
- **Labs:** On a stressed VM, identify CPU vs. memory vs. disk vs. network bottleneck via the USE method.
- **Resources:** *Systems Performance* Ch. 2 (Methodology), Ch. 6–10; Brendan Gregg's USE Method page.

### Module 2.15 — Kernel Basics & Advanced Performance (Deep End)
- **Concepts:** User vs. kernel space; system calls; scheduling; virtual memory/paging; page cache; filesystems (ext4, XFS) and mount options; `/proc` and `/sys`; `perf`; `ftrace`; eBPF/BCC/bpftrace intro; flame graphs.
- **Labs:** Generate a CPU flame graph; trace slow syscalls with `perf`.
- **Resources:** *Systems Performance* Ch. 3–4, 13–15; *The Linux Programming Interface* (Kerrisk); *BPF Performance Tools* (Gregg).

---

## TRACK 3 — SQL + DATA ENGINEERING

**Track goal:** From first `SELECT` to designing, validating, reconciling, and orchestrating production data pipelines that researchers depend on.

**Anchor resources:** **Use The Index, Luke** / *SQL Performance Explained* (Markus Winand — vendor-agnostic indexing/tuning across Oracle, MySQL, PostgreSQL, SQL Server, and Db2, the web edition of the book); official PostgreSQL/MySQL/SQL Server docs; *Designing Data-Intensive Applications* (Martin Kleppmann); *Fundamentals of Data Engineering* (Reis & Housley, O'Reilly, 2022); *The Data Warehouse Toolkit, 3rd ed.* (Kimball & Ross).

### Module 3.1 — The Relational Model & SQL Fundamentals
- **Concepts:** Relations, tuples, attributes, keys; `SELECT`/`FROM`/`WHERE`; comparison/logical operators; `NULL` and three-valued logic; `DISTINCT`; `ORDER BY`; `LIMIT`/`OFFSET`/`FETCH`; data types across dialects.
- **Labs:** Query a sample equities reference table (tickers, sectors, listing dates).
- **Resources:** PostgreSQL Tutorial; *SQL for Data Analysis* (Cathy Tanimura).
- **Cross-ref:** Uses Track 6 security-master concepts as data.

### Module 3.2 — Aggregation, Joins & Set Operations
- **Concepts:** Aggregates (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`); `GROUP BY`/`HAVING`; all join types (inner, left/right/full outer, cross, self, anti/semi); `UNION`/`INTERSECT`/`EXCEPT`; join order and cardinality intuition.
- **Labs:** Join trades to a security master; aggregate volume by sector.
- **Resources:** Official docs join chapters; *SQL for Data Analysis*.

### Module 3.3 — Subqueries & CTEs
- **Concepts:** Scalar/row/table subqueries; correlated subqueries; `IN`/`EXISTS`/`ANY`/`ALL`; CTEs (`WITH`); recursive CTEs; materialization differences across dialects.
- **Labs:** Recursive CTE over a corporate-parent hierarchy.
- **Resources:** Use The Index, Luke; official docs.

### Module 3.4 — Window Functions (Deep)
- **Concepts:** `OVER`, `PARTITION BY`, `ORDER BY`; ranking (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`); offset (`LAG`, `LEAD`); aggregate windows; frames (`ROWS` vs. `RANGE`, `BETWEEN`); running totals, moving averages, period-over-period.
- **Labs:** Trailing-20-day moving average and daily returns on a price series.
- **Resources:** Use The Index, Luke (window functions & pagination); *SQL for Data Analysis*; modern-sql.com.
- **Cross-ref:** Directly applicable to Track 6 market-data analytics.

### Module 3.5 — DDL, DML & Transactions
- **Concepts:** `CREATE`/`ALTER`/`DROP`; constraints (PK, FK, unique, check, not-null); `INSERT`/`UPDATE`/`DELETE`/`MERGE`/`UPSERT`; transactions; ACID; isolation levels (read uncommitted → serializable); locking/deadlocks; MVCC.
- **Labs:** Model and populate a trade-capture schema with referential integrity.
- **Resources:** *DDIA* Ch. 7 (Transactions); official isolation docs.

### Module 3.6 — Indexing, Execution Plans & Query Tuning
- **Concepts:** B-tree indexes; composite index column order; covering indexes; index-only scans; `EXPLAIN`/`EXPLAIN ANALYZE`; scan types; join algorithms (nested loop, hash, merge); statistics and cardinality; when indexes hurt; partitioning.
- **Labs:** Tune a slow multi-join query to an index-only plan; document before/after plans.
- **Resources:** *SQL Performance Explained* (Winand) cover-to-cover; official `EXPLAIN` docs.

### Module 3.7 — Dialect Differences & Portability
- **Concepts:** Type differences; identifier quoting; `LIMIT` vs. `TOP` vs. `FETCH`; string/date function differences; auto-increment/identity/sequences; upsert differences; PL/pgSQL vs. T-SQL vs. MySQL procs; NULL quirks.
- **Labs:** Port a non-trivial query across all three dialects.
- **Resources:** Official docs per engine; modern-sql.com comparisons.

### Module 3.8 — Data Modeling
- **Concepts:** Normalization (1NF→BCNF) and denormalization tradeoffs; ER modeling; OLTP vs. OLAP; dimensional modeling (facts, dimensions, star vs. snowflake); slowly changing dimensions **Types 0–7**; surrogate vs. natural keys; conformed dimensions; the bus matrix; data vault at a high level.
- **Labs:** Star schema for daily trade/position facts with security and date dimensions.
- **Resources:** *The Data Warehouse Toolkit, 3rd ed.* (Kimball & Ross) Ch. 1–3 — including the four-step design process: select the business process, declare the grain, choose the dimensions, identify the facts; *DDIA* Ch. 3.
- **Cross-ref:** Track 6 reference-data concepts define the dimensions.

### Module 3.9 — The Data Engineering Lifecycle & ETL/ELT Design
- **Concepts:** The data engineering lifecycle — **generation → storage → ingestion → transformation → serving** — and its undercurrents (security, data management, DataOps, data architecture, orchestration, software engineering); ETL vs. ELT; batch vs. streaming; idempotency; incremental vs. full loads; backfills; watermarks and late-arriving data.
- **Labs:** Design an ELT pipeline from a market-data vendor file to a warehouse.
- **Resources:** *Fundamentals of Data Engineering* Ch. 1–2, 5–9; *DDIA* Ch. 10–11.
- **Cross-ref:** Consumes Track 1 (Python) and Track 2 (scheduling).

### Module 3.10 — Data Formats & Storage
- **Concepts:** Row vs. columnar; CSV, JSON, **Parquet**, **Avro**, ORC; schema-on-read vs. -write; compression (Snappy, gzip, zstd); partitioning and file sizing; lakes vs. warehouses vs. lakehouses; object storage; table formats (Iceberg, Delta, Hudi) at a high level.
- **Labs:** Convert a large CSV to partitioned Parquet; benchmark in DuckDB.
- **Resources:** *Fundamentals of Data Engineering* Ch. 6; Apache Parquet/Avro docs.
- **Cross-ref:** Builds on Track 1 Module 1.16 (PyArrow/DuckDB).

### Module 3.11 — Data Classification, Onboarding & Enrichment
- **Concepts:** Dataset onboarding workflows; classification (sensitivity, ownership, retention); schema inference and data contracts; metadata/cataloging; enrichment (joining reference/derived attributes); entity resolution; master data management basics.
- **Labs:** Onboard a new vendor dataset: infer schema, classify, document a data contract, enrich with reference data.
- **Resources:** *Fundamentals of Data Engineering* Ch. 9 and the data-management undercurrent; DAMA-DMBOK selected chapters.

### Module 3.12 — Data Validation, Quality & Anomaly Detection
- **Concepts:** Data-quality dimensions (accuracy, completeness, consistency, timeliness, validity, uniqueness); declarative validation with **Great Expectations** (Expectations, Suites, Checkpoints, Data Docs) and **dbt tests** (generic tests `unique`/`not_null`/`accepted_values`/`relationships`, singular tests, the `dbt-expectations` package for range/freshness/distribution checks); statistical anomaly detection in derived datasets; detecting bad ticks, stale prices, and missing corporate-action adjustments.
- **Labs:** Wire Great Expectations onto raw ingestion and dbt tests onto transformed models; build a check that flags missing trading-day data.
- **Resources:** Great Expectations docs; dbt testing docs; dbt-expectations (calogica) package.
- **Cross-ref:** Track 6 Module 6.13 covers the finance-specific techniques in depth.

### Module 3.13 — Data Reconciliation & Lineage (Data Debugging)
- **Concepts:** Reconciliation patterns (row counts, checksums, control totals, key-level diffs, tolerance-based matching); the "break" concept; source-to-target and column-level lineage; data debugging (bisecting a pipeline); audit trails; idempotent reprocessing.
- **Labs:** Build a reconciliation report comparing a derived table against its source with tolerance thresholds and break classification.
- **Resources:** *Fundamentals of Data Engineering* (data management/DataOps undercurrents); OpenLineage / dbt lineage docs.
- **Cross-ref:** Finance-specific reconciliation hierarchy in Track 6 Module 6.13.

### Module 3.14 — Orchestration
- **Concepts:** DAGs; **Airflow** (operators, tasks, scheduling, XCom, sensors, backfills); **Dagster** (software-defined assets, ops); **dbt** (models, refs, materializations, tests, docs, snapshots for SCDs); dependencies, retries, alerting; orchestration vs. scheduling.
- **Labs:** Orchestrate the Module 3.9 pipeline in Airflow (or Dagster) with dbt transformations and failure alerts.
- **Resources:** Airflow, Dagster, dbt official docs; *Fundamentals of Data Engineering* Ch. 8.
- **Cross-ref:** Track 4 covers monitoring/alerting for these pipelines.

### Module 3.15 — Data Warehousing & Serving Researchers (Capstone)
- **Concepts:** Cloud warehouses (Snowflake, BigQuery, Redshift) and query engines; semantic layers; cleaning and featurizing data for research; reverse ETL; cost/performance management; serving analytics vs. ML features; reproducibility.
- **Labs:** Capstone — build a governed, tested, orchestrated pipeline serving a research-ready featurized dataset (e.g., corporate-action-adjusted daily returns) with documented lineage and quality checks.
- **Resources:** *Fundamentals of Data Engineering* Ch. 9; warehouse vendor docs; *The Data Warehouse Toolkit* for mart design.

---

## TRACK 4 — SRE / PRODUCTION SUPPORT

**Track goal:** From "what is reliability" to running incidents and designing observability under pressure.

**Anchor resources:** Google's *Site Reliability Engineering* and *The Site Reliability Workbook* (both free at sre.google); *Observability Engineering* (Majors, Fong-Jones, Miranda, O'Reilly); *Prometheus: Up & Running, 2nd ed.* (Julien Pivotto & Brian Brazil, O'Reilly); *Release It!* (Michael Nygard).

### Module 4.1 — SRE Principles & Philosophy
- **Concepts:** SRE vs. traditional ops vs. DevOps; "operations as a software problem"; embracing risk; the error-budget bargain between reliability and feature velocity; toil; the SRE engagement model.
- **Labs:** One-page reliability charter for a hypothetical market-data service.
- **Resources:** *Site Reliability Engineering* Part I–II; *SRE Workbook* intro.

### Module 4.2 — SLIs, SLOs, SLAs & Error Budgets
- **Concepts:** SLIs, SLOs, SLAs; the SLI equation (good events / valid events); choosing SLIs; setting SLO targets; **error budgets (100% − SLO** — e.g., a 99.9% SLO permits 0.1% errors, and teams halt releases when the budget is exhausted); burn rate and multi-window burn-rate alerting; error-budget policies; critical user journeys.
- **Labs:** Define SLIs/SLOs and an error-budget policy for a data pipeline (freshness and completeness SLOs).
- **Resources:** *SRE Workbook* "Implementing SLOs"; *SRE* Ch. 3–4; example SLO/error-budget appendices.

### Module 4.3 — Monitoring vs. Observability & the Three Pillars
- **Concepts:** Monitoring (known-unknowns) vs. observability (unknown-unknowns); the three pillars — metrics, logs, traces; white-box vs. black-box; cardinality and dimensionality; structured events; OpenTelemetry.
- **Labs:** Instrument a small service to emit all three signal types.
- **Resources:** *Observability Engineering* Ch. 1–5; *SRE* Ch. 6 (Monitoring).

### Module 4.4 — The Four Golden Signals & Metrics
- **Concepts:** Per Google's *SRE* book: "The four golden signals of monitoring are latency, traffic, errors, and saturation. If you can only measure four metrics of your user-facing system, focus on these four." RED (Rate/Errors/Duration) and USE methods; percentiles vs. means (p50/p95/p99); histograms; counters/gauges/summaries; aggregation pitfalls.
- **Labs:** Dashboard covering the four golden signals for a service.
- **Resources:** *SRE* Ch. 6; Brendan Gregg USE method; Tom Wilkie RED method.

### Module 4.5 — Prometheus & PromQL
- **Concepts:** Prometheus architecture (pull-based scraping, service discovery); label-based data model; exporters (node_exporter); PromQL (selectors, `rate`/`irate`, aggregation operators, functions, subqueries); recording rules; TSDB basics; push gateway.
- **Labs:** Stand up Prometheus + node_exporter; write PromQL for the golden signals and an SLO burn rate.
- **Resources:** *Prometheus: Up & Running, 2nd ed.*; official Prometheus docs.

### Module 4.6 — Grafana & Dashboarding
- **Concepts:** Data sources; panels/queries; dashboard design principles; variables and templating; SLO/burn-rate overlays; avoiding dashboard sprawl; alerting from Grafana.
- **Labs:** Build a service dashboard and an SLO dashboard.
- **Resources:** Grafana official docs; *Observability Engineering* dashboarding chapters.

### Module 4.7 — Alerting Design
- **Concepts:** Alerting on SLOs vs. causes; symptom-based alerting; reducing noise (chatty vs. noisy alerts); multi-window multi-burn-rate alerts; severity/classification frameworks; paging vs. ticket vs. log; alert fatigue; runbooks linked to alerts; Alertmanager (routing, grouping, silencing, inhibition).
- **Labs:** Convert naive threshold alerts into SLO burn-rate alerts; write the runbook.
- **Resources:** *SRE* Ch. 6; *SRE Workbook* "Alerting on SLOs"; *Observability Engineering* alerting chapter.

### Module 4.8 — Incident Response & Management
- **Concepts:** Severity levels; the Incident Command System (incident commander, operations lead, communications lead, and a scribe/planning role); escalation paths; declare/mitigate/resolve; communication cadence; mitigation before root cause; incident tooling (paging, war rooms, status pages).
- **Labs:** Run a tabletop incident exercise with assigned roles.
- **Resources:** *SRE* Ch. 14 (Managing Incidents); PagerDuty Incident Response docs; *SRE Workbook* incident chapters.

### Module 4.9 — On-Call Practices & Rotations
- **Concepts:** Rotation design; primary/secondary; handoffs; escalation policies; on-call load and health; compensation/fairness; follow-the-sun; balancing on-call with project work; paging discipline.
- **Labs:** Design a humane on-call rotation and handoff template.
- **Resources:** *SRE* Ch. 11 (Being On-Call); *SRE Workbook* on-call chapter.

### Module 4.10 — Postmortems, Blameless Culture & RCA
- **Concepts:** Blameless postmortem culture; postmortem structure (timeline, impact, root cause, action items); RCA techniques (5 Whys, causal analysis, contributing factors); "no single root cause" in complex systems; tracking action items; learning-from-incidents movement.
- **Labs:** Write a blameless postmortem for the tabletop incident with RCA and action items.
- **Resources:** *SRE* Ch. 15 (Postmortem Culture); example postmortem appendix; Allspaw/Etsy writings on blamelessness.

### Module 4.11 — Toil Reduction & Automation
- **Concepts:** Defining and measuring toil; the toil budget; automation ROI; human-backed interfaces as a stepping stone; self-service; automating production-support tasks.
- **Labs:** Identify a toil source and automate it with a Python/Bash tool.
- **Resources:** *SRE* Ch. 5 (Eliminating Toil); *SRE Workbook* automation case studies.
- **Cross-ref:** Uses Track 1 and Track 2 scripting.

### Module 4.12 — Capacity Planning & Reliability Patterns
- **Concepts:** Capacity planning and demand forecasting; load testing; redundancy (N+1, active/active); graceful degradation; circuit breakers; retries with backoff and jitter; timeouts; bulkheads; load shedding; rate limiting; failover and DR.
- **Labs:** Add a circuit breaker and graceful degradation to a service dependency.
- **Resources:** *SRE* Ch. 21–22 (Handling Overload, Addressing Cascading Failures); *Release It!* (Nygard).

### Module 4.13 — Production Support Workflows & Proactive Pipeline Oversight (Capstone)
- **Concepts:** Handling internal customer inquiries; triage and prioritization; support turnaround/SLAs; ticket workflows; proactive monitoring of data pipelines (freshness, completeness, latency); troubleshooting under pressure; escalation to engineering; knowledge bases and runbooks.
- **Labs:** Capstone — design a production-support playbook for a market-data pipeline: SLOs, dashboards, alerts, runbooks, triage matrix, escalation.
- **Resources:** *SRE Workbook* (data-processing-pipeline SLO examples); *Observability Engineering* on team culture.
- **Cross-ref:** Directly supports Track 3 pipelines and Track 6 operations.

---

## TRACK 5 — IT OPERATIONS & ENDPOINT ENGINEERING

**Track goal:** From help-desk fundamentals to architecting identity, endpoint fleets, and IT automation across macOS, Linux, and Windows.

**Anchor resources:** CompTIA A+ and Network+ objectives for foundations; Microsoft Learn (Windows/AD/M365); *Active Directory, 5th ed.* (O'Reilly); Jamf and Puppet official docs/training; Okta docs; *The Practice of System and Network Administration, 3rd ed.* (Limoncelli, Hogan, Chalup); *Pro Git* (Chacon & Straub).

### Module 5.1 — IT Operations Foundations & Hardware
- **Concepts:** Workstation architecture (CPU, RAM, storage, GPU, PSU, motherboard); peripherals/displays; laptops vs. desktops vs. thin clients; BIOS/UEFI; POST; hardware debugging and repair; cable management; workstation setup; hardware refresh cycles; the help-desk/support-tier model.
- **Labs:** Disassemble/reassemble a workstation; diagnose a no-boot from POST codes; build a cable-managed desk setup.
- **Resources:** CompTIA A+ Core 1 objectives; *The Practice of System and Network Administration* (workstations).

### Module 5.2 — OS Administration: Windows
- **Concepts:** Windows architecture; registry; services; Task Manager/Resource Monitor/Performance Monitor; Event Viewer; diagnosing performance issues; driver conflicts and Device Manager; application errors and crash dumps; Windows networking; PowerShell for admin.
- **Labs:** Diagnose a slow Windows machine (CPU/RAM/disk/driver); resolve a driver conflict.
- **Resources:** Microsoft Learn (Windows client); *Windows Internals* (Russinovich et al.) for depth.

### Module 5.3 — OS Administration: macOS
- **Concepts:** macOS architecture (Darwin/BSD underpinnings); System Settings; launchd/launchctl; Console/logs; Activity Monitor; Disk Utility and APFS; Gatekeeper, XProtect, notarization; common user issues; CLI admin (`defaults`, `profiles`).
- **Labs:** Diagnose a macOS performance/startup issue; script a defaults change.
- **Resources:** Apple Platform Deployment/Support docs; Jamf "Apple Device Management for Beginners."
- **Cross-ref:** Track 2 Linux/Unix skills transfer heavily.

### Module 5.4 — OS Administration: Linux (Endpoint/Server Ops)
- **Concepts:** User/package/service management at fleet scale; SSH key management; hardening basics; patching; endpoint monitoring; systemd/logs/networking recap in an ops context.
- **Labs:** Provision and harden a Linux workstation to a baseline.
- **Resources:** Track 2 anchors; *The Practice of System and Network Administration*.

### Module 5.5 — Active Directory (Deep)
- **Concepts:** Domains, trees, forests; domain controllers; OUs; users, groups (security/distribution), computers; the schema; NTDS.dit and SYSVOL; **Kerberos** authentication (the KDC issues a Ticket Granting Ticket/TGT, which the client uses to request service tickets) and **LDAP**; NTLM (legacy); FSMO roles; sites and replication topology (KCC, site links); DNS integration; delegation; Group Managed Service Accounts; troubleshooting (trust, replication, RPC).
- **Labs:** Build a home-lab domain; create an OU/GPO structure; simulate and diagnose a replication issue.
- **Resources:** *Active Directory, 5th ed.* (O'Reilly); Microsoft Learn AD DS docs.

### Module 5.6 — Group Policy (GPOs)
- **Concepts:** GPO structure — a Group Policy Container in AD plus a Group Policy Template in SYSVOL; linking to sites/domains/OUs; inheritance, block inheritance, enforced; precedence/LSDOU; security filtering; WMI filtering; loopback processing; Group Policy Preferences; GPO backup/modeling; refresh behavior; performance considerations.
- **Labs:** Enforce a security baseline via GPO (password policy, lock screen, USB restrictions) with a separate IT-OU exception GPO.
- **Resources:** *Active Directory, 5th ed.* Ch. 11; Microsoft Learn Group Policy docs.

### Module 5.7 — Identity & Access Management with Okta
- **Concepts:** IAM concepts (authentication, authorization, access control); SSO; **SAML** and **OIDC/OAuth 2.0**; **SCIM** provisioning/deprovisioning (the joiner-mover-leaver lifecycle); MFA and phishing-resistant factors (FastPass, FIDO2); Universal Directory; lifecycle management; Okta Workflows; the crucial distinction that **SAML handles authentication only while SCIM handles provisioning** — both are needed because a disabled SAML account still leaves the local application record, API keys, and non-SAML login paths intact.
- **Labs:** Configure a SAML app + SCIM provisioning in an Okta developer org; enforce MFA.
- **Resources:** Okta developer docs (IAM overview, Understanding SCIM); learning.okta.com.
- **Cross-ref:** Identity concepts overlap with Module 5.5 (AD) and Track 4 (tooling access).

### Module 5.8 — Cloud Productivity Admin: Google Workspace & Microsoft 365
- **Concepts:** Google Workspace Admin Console (OUs, groups, user lifecycle, security settings, context-aware access); Microsoft 365 admin (Entra ID/Azure AD, Exchange Online, Teams, SharePoint/OneDrive, licensing, Conditional Access); hybrid identity (AD ↔ Entra sync); DMARC/SPF/DKIM.
- **Labs:** Onboard and offboard a user end-to-end in each suite.
- **Resources:** Google Workspace Admin Help; Microsoft Learn (M365/Entra).

### Module 5.9 — SaaS Platform Administration (Jira, Slack, Zoom)
- **Concepts:** Jira/Atlassian admin (projects, permissions, workflows, automation); Slack admin (workspaces, SSO, retention, apps); Zoom admin (SSO, policies, security); SaaS integration via SSO/SCIM; app governance and least privilege.
- **Labs:** Wire Slack and Jira to Okta SSO with SCIM; build a Jira automation rule.
- **Resources:** Atlassian, Slack, Zoom admin docs.

### Module 5.10 — Endpoint Management: Jamf (Apple MDM)
- **Concepts:** MDM framework and APNs (chain of trust, push); the two Jamf Pro mechanisms — **the Jamf binary (a pull model that checks in on a schedule)** and **MDM (a push model via Apple Push Notification service)**; enrollment (Automated Device Enrollment/zero-touch, Apple Business Manager); configuration profiles; policies, packages, scripts; Smart vs. Static Groups; Self Service; patch management; Declarative Device Management (DDM); inventory/compliance.
- **Labs:** Enroll a Mac; deploy an app + configuration profile; build a Smart Group–scoped policy.
- **Resources:** Jamf official docs and training catalog; JNUC sessions; "Apple Device Management for Beginners."

### Module 5.11 — Endpoint Management: Puppet (Configuration Management)
- **Concepts:** Declarative, idempotent configuration; resources and the RAL; **manifests (`.pp` files)**; classes; **modules (collections of manifests and data)**; defined types; facts (Facter); catalogs; agent/master (agent sends facts, master compiles and returns a catalog, agent applies it) vs. standalone; Hiera data; templates (ERB); ordering/dependencies (`require`, `notify`, `subscribe`); the roles-and-profiles pattern; PDK and testing (rspec-puppet, puppet-lint); Puppet Forge.
- **Labs:** Write a module enforcing package + config + service with proper ordering; test with PDK.
- **Resources:** Puppet official docs (puppet.com/docs); *Learning Puppet* materials; DigitalOcean Puppet tutorials.
- **Cross-ref:** Builds on Track 2 (Linux) and Track 1 (DSL, testing mindset).

### Module 5.12 — Version Control (Git) & Developer Workflows / CI-CD
- **Concepts:** Git model (commits, trees, blobs, refs); branching/merging/rebasing; remotes; pull requests and code review; merge strategies; tags; `.gitignore`; conflict resolution; Git internals; CI/CD concepts (pipelines, runners, artifacts); GitHub Actions/GitLab CI basics; IaC and GitOps intro.
- **Labs:** Manage a repo through a full branch→PR→CI→merge cycle; write a simple CI workflow.
- **Resources:** *Pro Git* (Chacon & Straub, free at git-scm.com); GitHub Actions / GitLab CI docs.
- **Cross-ref:** Underpins Tracks 1, 3, and 4 delivery.

### Module 5.13 — IT Asset Lifecycle, Compliance & Documentation
- **Concepts:** Asset lifecycle (procure → deploy → maintain → retire → dispose); CMDB/asset inventory; software license compliance; data sanitization/disposal; compliance frameworks (SOC 2, ISO 27001) at an IT-ops level; documentation practices (runbooks, KBs, diagrams); change management (ITIL basics).
- **Labs:** Build an asset-tracking sheet/CMDB and a documentation template set.
- **Resources:** *The Practice of System and Network Administration*; ITIL foundations overview.

### Module 5.14 — Onboarding/Offboarding & IT Automation (Capstone)
- **Concepts:** User/hardware onboarding and offboarding workflows; provisioning automation across identity (Okta/AD), productivity suites, SaaS, and endpoints; scripting IT tasks (Python/Bash/PowerShell); self-service; on-call IT support practices; measuring and reducing IT toil.
- **Labs:** Capstone — automate an end-to-end onboarding (identity + email + SaaS + endpoint enrollment) and a secure offboarding, with documentation and audit trail.
- **Resources:** Vendor APIs (Okta, Google, M365); Track 1/Track 2 scripting anchors; Track 4 toil-reduction principles.
- **Cross-ref:** Combines Tracks 1, 2, 4, and this track's identity/endpoint modules.

---

## TRACK 6 — FINANCE & TRADING CONTEXT

**Track goal:** From "what is a stock" to fluently supporting researchers and trading operations, with special depth on the data-reconciliation and reference-data problems an engineer actually faces.

**Anchor resources:** *Trading and Exchanges: Market Microstructure for Practitioners* (Larry Harris, Oxford, 2003 — widely regarded as essential reading for entrants to the securities industry); Michael Simmons, *Securities Operations: A Guide to Trade and Position Management* (Wiley); Simmons & Dalgleish, *Corporate Actions: A Guide to Securities Event Management* (Wiley); ISO/SWIFT and DTCC primary documentation for standards; *Options, Futures, and Other Derivatives* (John Hull).

### Module 6.1 — How Financial Markets Work
- **Concepts:** What securities are and why they exist; primary vs. secondary markets; issuers, investors, intermediaries; exchanges vs. OTC; buy side vs. sell side; the role of capital markets; a taxonomy of asset classes.
- **Labs:** Diagram the flow of an order from investor to exchange to settlement.
- **Resources:** *Trading and Exchanges* Ch. 1–3.

### Module 6.2 — Market Participants
- **Concepts:** Investors (retail, institutional), brokers, dealers, market makers, arbitrageurs, hedgers, speculators, day traders; buy side (asset managers, hedge funds, pensions) vs. sell side (banks, broker-dealers); custodians, clearing houses, CSDs; regulators.
- **Labs:** Map participants onto the order-flow diagram.
- **Resources:** *Trading and Exchanges* Part I.

### Module 6.3 — Market Structure & Microstructure
- **Concepts:** Order-driven vs. quote-driven markets; auction mechanisms (open outcry, single-price/call auctions, continuous); ECNs and dark pools; price/time priority; liquidity, spread, depth, market impact; latency and HFT at a high level; fragmentation and best execution.
- **Labs:** Simulate a simple limit-order-book matching engine.
- **Resources:** *Trading and Exchanges* (core of the book); *Empirical Market Microstructure* (Hasbrouck) for depth.

### Module 6.4 — Order Types & the Order Book
- **Concepts:** Market, limit, stop, stop-limit, market-if-touched; time-in-force (day, GTC, IOC, FOK); iceberg/hidden orders; limit-order-book anatomy (bids/asks, levels, size); order matching; fills and partial fills; program/block trades.
- **Labs:** Annotate a sample order book; classify a set of orders.
- **Resources:** *Trading and Exchanges* (order types and precedence).

### Module 6.5 — The Trading Day Lifecycle
- **Concepts:** Pre-market; opening auction; regular/continuous hours; closing auction; post-market/after-hours; halts and circuit breakers; time zones and market calendars; settlement-cycle context.
- **Labs:** Build a market-calendar/session utility (ties to Track 1 datetime).
- **Resources:** Exchange rulebooks (NYSE/Nasdaq); *Trading and Exchanges*.

### Module 6.6 — Market Data (Level 1/2/3, Tick Data)
- **Concepts:** Quotes vs. trades; Level 1 (top of book/BBO), Level 2 (depth), Level 3 (full order-by-order); tick data; OHLCV bars; consolidated vs. direct feeds; timestamps and sequencing; data volume and normalization; identifiers on the wire.
- **Labs:** Parse and normalize a sample tick feed into bars.
- **Resources:** Vendor docs (Databento, exchanges); *Trading and Exchanges* on data.
- **Cross-ref:** Track 3 pipelines and Track 1 data stack process this.

### Module 6.7 — Reference Data & the Security Master
- **Concepts:** The security master; instrument identifiers — **ISIN (ISO 6166**, a 12-character code: 2-letter country + 9-char NSIN + check digit**)**, **CUSIP** (US/Canada, via CUSIP Global Services), **SEDOL** (UK), **FIGI (ANSI X9.145-2021**, via OpenFIGI**)**, **RIC**; the deterministic US ISIN = "US" + 9-char CUSIP + check digit relationship; **MIC (ISO 10383)** for venues; **LEI (ISO 17442)** for entities; **CFI (ISO 10962)**; identifier granularity (share-class vs. composite vs. venue-level) and persistence differences — an ISIN can change on corporate actions, whereas the FIGI standard specifies the identifier "never changes as a result of any corporate action"; mapping across vendors.
- **Labs:** Build a cross-vendor identifier mapping table and detect conflicts.
- **Resources:** ANNA (ISO 6166 maintenance agency); OpenFIGI docs; DTCC Security Master File Data factsheet; Simmons, *Securities Operations*.
- **Cross-ref:** These are the dimensions in Track 3 Module 3.8.

### Module 6.8 — Corporate Actions
- **Concepts:** Mandatory vs. voluntary vs. mandatory-with-choice events; dividends (cash/stock), stock splits and reverse splits, rights issues/**equity rights (ERC)**, mergers and acquisitions, spin-offs, symbol/name changes, tender offers; key dates (announcement, ex-date, record date, pay-date); price/quantity adjustment factors; the event lifecycle; SWIFT/ISO messaging — **ISO 15022 MT564** (notification), **MT565** (instruction), **MT566** (confirmation), **MT567** (status), and their **ISO 20022 seev.*** successors; why unadjusted data corrupts research.
- **Labs:** Apply split and dividend adjustment factors to a price series; process a sample MT564 notification.
- **Resources:** Simmons & Dalgleish, *Corporate Actions: A Guide to Securities Event Management*; SWIFT ISO 15022/20022 CA docs; DTCC corporate-actions docs.

### Module 6.9 — Asset Classes in Depth
- **Concepts:** Equities (common/preferred, ADRs); fixed income (bonds, yields, coupons, accrued interest, duration); FX (spot/forward, currency pairs, conventions); derivatives (futures, forwards, options — calls/puts, Greeks at a high level; swaps incl. total-return/equity swaps); ETFs; each class's data and lifecycle quirks.
- **Labs:** Model a coupon bond's cashflows and a vanilla option payoff.
- **Resources:** *Options, Futures, and Other Derivatives* (Hull); *Fixed Income Securities* (Fabozzi).

### Module 6.10 — Market Data Vendors & Financial Datasets
- **Concepts:** Bloomberg (Terminal, Enterprise Data, B-PIPE), Refinitiv/LSEG (Workspace/Eikon, QA Direct), S&P (Capital IQ), FactSet; exchange direct feeds; tick-data vendors (Databento); pricing/reference/regulatory/ESG data; entitlements and licensing; delivery (files, APIs, real-time feeds); cost structures.
- **Labs:** Compare two vendors' coverage/format for the same instruments; design an ingestion plan.
- **Resources:** Vendor product docs (Bloomberg, LSEG, S&P); vendor-comparison analyses.
- **Cross-ref:** Track 3 Module 3.11 onboarding.

### Module 6.11 — Settlement, Clearing & Market Infrastructure
- **Concepts:** Clearing vs. settlement; central counterparties (CCPs) and novation; **DTCC** and its subsidiaries — **NSCC** (the central counterparty for US broker-to-broker equities, running Continuous Net Settlement/CNS), **DTC** (the central securities depository holding securities in book-entry form, with net debit caps and a collateral monitor), **FICC** (fixed income clearing); custodians and sub-custodians; book-entry vs. physical; the operational pressure of a shortened settlement cycle; settlement fails.
- **Labs:** Trace a trade through clearing and settlement, identifying each infrastructure actor.
- **Resources:** DTCC official documentation; Simmons, *Securities Operations*.

### Module 6.12 — Trade Lifecycle: Front, Middle & Back Office
- **Concepts:** Front office (order initiation, execution); middle office (risk, order routing, trade capture, validation); back office (affirmation/confirmation, clearing, settlement, reconciliation, books & records); straight-through processing (STP); trade breaks; the operational-risk framework.
- **Labs:** Build a state machine for a trade from order to settled.
- **Resources:** Simmons, *Securities Operations* (the definitive operations text); "Securities Trade Lifecycle" practitioner courses.

### Module 6.13 — Data Reconciliation & Quality for Trading Data (Deep — Capstone-critical)
- **Objectives:** Master the finance-specific reconciliation and validation patterns that define the engineer's daily work.
- **Concepts:**
  - **The reconciliation hierarchy:** reconcile **trade → position → cash → P&L → NAV**, in order, because upstream breaks cascade; do **position reconciliation before cash** (a position influences cash, not vice versa); NAV usually reconciles automatically if P&L/positions/cash match.
  - **Named reconciliation types:** *trade reconciliation* (internal vs. broker/custodian/clearing records; match on ISIN, quantity, trade date, settlement date, counterparty, price; a mismatch is a "break"; a "settlement convention break" arises from differing holiday calendars); *position reconciliation* (holdings vs. fund administrator on trade date); *cash reconciliation* (trade-date cash vs. administrator, settlement/value-date cash vs. custodian); **nostro/vostro** correspondent-banking cash reconciliation (typically one nostro account per currency); **price/mark reconciliation and Independent Price Verification (IPV)** with pre-agreed tolerances; **portfolio reconciliation for OTC derivatives** (ISDA guidance — trade-by-trade with matching tolerances; the spread field is a common equity-swap break source); corporate-action reconciliation on ex-date.
  - **Reconciliation process:** import → transform/normalize → match (rule-based, by identifier + fund, tolerance-based) → investigate/resolve breaks → audit trail; first-pass auto-match rate as a KPI.
  - **Anomaly detection in market data:** bad-tick detection via the **Brownlees & Gallo (2006)** filter — from *Computational Statistics & Data Analysis* 51(4):2232–2245 — which flags a price p_i when |p_i − p̄_i(k)| ≥ 3·s_i(k) + γ, using the trimmed sample mean/SD over a k-observation window and a granularity parameter γ related to tick size; the more robust **rolling median/MAD filter** (Barndorff-Nielsen et al.); stale/non-synchronous price detection; the over-scrub vs. under-scrub tradeoff; preferring exchange trade-condition flags over statistical cleaning; detecting missing/incorrect corporate-action adjustments.
  - **Point-in-time / bitemporal data:** two time axes — event/valid time vs. recording/knowledge ("as-of") time; why PIT data prevents **look-ahead bias** (using data at simulated time T-1 that was only known later, via reporting lag, restatements, or backfill) and is distinct from but co-occurs with **survivorship bias**; as-reported vs. restated data; reproducibility for auditors/regulators.
- **Labs:** Build a trade-vs-position reconciliation with tolerance matching and break classification; implement a Brownlees-Gallo bad-tick filter; construct a point-in-time dataset that avoids look-ahead bias.
- **Resources:** Simmons, *Securities Operations* Ch. 27 (Reconciliation); Brownlees & Gallo (2006), *Computational Statistics & Data Analysis*; ISDA portfolio-reconciliation guidance; NY Fed *Management of Operational Risks in Foreign Exchange* (Best Practices 34–38); point-in-time/bitemporal data literature.
- **Cross-ref:** This is the finance-specific deepening of Track 3 Modules 3.12–3.13.

### Module 6.14 — P&L, Risk, Regulation & Supporting Researchers (Capstone)
- **Concepts:** P&L basics (realized vs. unrealized, mark-to-market, attribution); risk concepts (market/credit/liquidity/operational risk, VaR at a high level, exposure, Greeks recap); regulatory/compliance context (SEC/FINRA, MiFID II, best execution, trade/transaction reporting, record-keeping rules such as SEC Rules 17a-3/17a-4); **the current US T+1 settlement cycle** (the SEC moved from T+2 to T+1 under amended Rule 15c6-1(a), compliance date May 28, 2024), which compresses the time available to identify and resolve reconciliation breaks; what quant researchers need from data (clean, adjusted, point-in-time, featurized) and how engineers deliver it.
- **Labs:** Capstone — produce a research-ready dataset (corporate-action-adjusted, point-in-time, reconciled, quality-checked) and document assumptions, lineage, and compliance considerations for a research team.
- **Resources:** Hull (risk/derivatives); regulator primary sources (SEC/FINRA); Track 3 and Module 6.13 anchors.
- **Cross-ref:** Ties together Tracks 1, 3, 4, and 6.

---

## Recommendations

**Stage 1 — Build the foundation (Months 1–3).** Author and study Tracks 1 and 2 in parallel. Do not advance to data engineering until the learner can (a) write a tested, typed, packaged Python CLI and (b) troubleshoot a stressed Linux VM to the correct resource bottleneck using the USE method. These are the objective completion benchmarks.

**Stage 2 — Add the data layer (Months 3–6).** Move to Track 3 once Track 1 Module 1.16 (pandas/DuckDB/SQLAlchemy) is complete, since the data-engineering labs depend on it. Benchmark: the learner can tune a slow multi-join query to an index-only plan and stand up an orchestrated, tested pipeline (Airflow/dbt) with reconciliation and quality checks.

**Stage 3 — Layer on reliability and operations (Months 6–10).** Tracks 4 and 5 can proceed together; they share identity and automation concepts. Benchmark for Track 4: the learner can define SLIs/SLOs and error-budget-based burn-rate alerts for a real pipeline and run a tabletop incident with correct ICS roles. Benchmark for Track 5: automate a full onboarding/offboarding across identity, SaaS, and endpoints.

**Stage 4 — Weave finance throughout (ongoing).** Read Track 6 Chapters 1–6 early for orientation, then return to Modules 6.7–6.14 once the learner is doing real data work. Module 6.13 (finance-specific reconciliation and PIT data) is the single highest-leverage chapter for a trading-environment engineer and should be treated as the domain capstone.

**Thresholds that would change the plan:** If the learner already codes fluently, compress Track 1 to Modules 1.9–1.16 and start Track 3 immediately. If the target role is pure production support/SRE rather than data engineering, front-load Track 4 after Track 2 and treat Track 3 as reference. If the environment is Windows/Active-Directory-heavy rather than Mac/Linux, prioritize Track 5 Modules 5.5–5.6 and de-emphasize Jamf (5.10).

**Authoring discipline:** Respect the cross-references as a strict write-order dependency graph. Each module should expand into a chapter with (1) narrative introduction, (2) worked examples, (3) the specified labs, (4) exercises/self-checks, and (5) the cited canonical resources. Because tooling churns, pin every tool-version-specific claim to a dated primary source (as done here for the GIL, T+1, and FIGI facts) and add a "currency check" note per chapter.

---

## Caveats

- **Tooling and versions drift.** Modules naming specific tools (uv, Polars, Dagster, Jamf DDM, Okta Workflows, free-threaded CPython) reflect the state as of mid-2026; the *concepts* are durable but commands, UIs, and defaults change. The free-threaded CPython path in particular is explicitly "officially supported but still optional" as of Python 3.14 — treat it as emerging, not default.
- **Some resources have edition and recency differences.** *Designing Data-Intensive Applications* has a long-awaited 2nd edition (Kleppmann & Riccomini) that was still being finalized; *Observability Engineering* has a substantially expanded 2nd edition. Cite the edition the learner actually uses. *Trading and Exchanges* (2003) is canonical but predates modern electronic-market and HFT detail, which should be supplemented (e.g., Hasbrouck).
- **The finance reconciliation/anomaly material blends authoritative and practitioner sources.** Definitional standards (ISO 6166, ANSI X9.145, SWIFT ISO 15022/20022, DTCC, SEC rules) and academic methods (Brownlees & Gallo) are authoritative; the reconciliation-sequencing heuristics and break taxonomies are practitioner conventions that vary by firm — present them as widely-used patterns, not universal law. A modern counterpoint worth teaching: some practitioners argue classic adaptive tick filters over-flag legitimate activity in today's electronic markets, so exchange trade-condition flags are preferred when available.
- **This is a blueprint, not the finished textbook.** It enumerates objectives, subtopics, labs, and resources per module; the actual chapter prose, worked examples, exercise sets, and datasets remain to be written. Lab difficulty and time estimates should be calibrated against a pilot cohort.
- **Regulatory specifics are jurisdiction- and date-sensitive.** T+1, MiFID II, and record-keeping rules cited are US/EU and current as of 2026; a firm operating in other jurisdictions must localize Module 6.14.

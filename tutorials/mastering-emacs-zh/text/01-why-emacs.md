# 导论与 Emacs 之道

> 原书来源：Mastering Emacs (Eli Spare)，第 8–37 页。
> 覆盖范围：Introduction + The Way of Emacs

## [p.8]
Chapter 1
Introduction
“I’m using Linux. A library that emacs uses to
communicate with Intel hardware.”
– Erwin, #emacs, Freenode.
Thank You
Thank you for purchasing Mastering Emacs. This book
has been a long time coming. When I started my blog,
Mastering Emacs, in 2010, it was at the recommendation of
a good friend, Lee, who suggested that I share my thoughts
on Emacs and work flow in Emacs. At the time I had
accrued in an org mode file titled blogideas.org a large but
random assortment of ideas and concepts that I’d learned
about and wished someone had taught me. The end result
of that file is the blog and now this book.
Special Thanks
8

## [p.9]
Introduction
I would like to thank the following people for
their encouragement, advice, suggestions and
critiques:
Akira Kitada, Alvaro Ramirez, Arialdo Martini,
Bob Koss, Catherine Mongrain, Chandan
Rajendra, Christopher Lee, Daniel Hannaske,
Edwin Ong, Evan Misshula, Friedrich Paetzke,
Gabriela Hajduk, Gabriele Lana, Greg Sieranski,
Holger Pirk, John Mastro, John Kitchin, Jonas
Enlund, Konstantin Nazarenko, Lee Cullip,
Luis Gerhorst, Lukas Pukenis, Manuel Uberti,
Marcin Borkowski, Mark Kocera, Matt Wilbur,
Matthew Daly, Michael Reid, Nanci Bonfim,
Oliver Martell, Patrick Mosby, Patrick Martin,
Sebastian Garcia Anderman, Stephen Nelson-
Smith, Steve Mayer, Tariq Master, Travis
Jefferson, Travis Hartwell.
Like a lot of people, I was thrust into the world of Emacs
without knowing anything about it; in my case it was in
my first year of University where the local computer soci-
ety was made up primarily of Vim users. It was explained
to me, in no uncertain terms, that “you use Vim — that’s
it.” Not wanting to be told what to do, I picked the polar
opposite of Vim and went with Emacs.
Emacs proved to be a stable and reliable editor in all those
years, but it was a tough one to get to know. Despite the
extensive user documentation, it never helped me to learn
and understand Emacs.
9

## [p.10]
Introduction
2024 Edition Update
Emacs 29 continues the long-running trend of keeping up
with advances in technology. That is commendable. Emacs
is an old piece of software, and yet it is continuously improv-
ing.
One of the hardest things to get right in a text editor is syn-
tax highlighting (fontlocking in Emacs parlance) and writing a
robust indentation engine. You see, when Emacs – and many
other editors, old and new – syntax highlight your source
code, they do so using regular expressions, a terse method for
matching text using pattern matching. Regular expressions
are great; they’re a succinct way of matching and extracting
important information from text. They are the backbone of
syntax highlighters nearly everywhere, but they also have a
flaw: they can be imprecise, and can impede performance if
they are poorly written.
A regular expression also cannot contextualize what it is
matching: just that it did (or did not) match something. For
a wide range of granular tasks, it is simply not possible to
rely on regular expressions. That is a problem as you want
as much precision as you can get. Yet it’s often impossible
to tell some things apart with a regular expression, such as
whether a series of characters is a variable or a function call.
The same series of characters may have one meaning in one
context, and an altogether different one in another. Regu-
lar expressions are rarely powerful enough to capture that
nuance. And so most text editors build their syntax high-
lighting and indentation engines with a medley of regular
expressions and hand-tuned, imperative code to try to work
10

## [p.11]
Introduction
around the limitations of the former.
Good news, then, as Emacs 29 adds optional support for tree-
sitter1 , a parser library with an exacting eye for source code
parsing that constructs a Concrete Syntax Tree from any text
for which it has a valid grammar. Such a tree is the perfect
medium for a computer (or willing user) to query. It makes
correct syntax highlighting possible with little more than a
few dozen lines of code. It also adds the tantalizing promise
of structured editing and movement, a sprawling concept that
reuses the tree-like structure tree-sitter yields to offer unpar-
alleled editing and movement in your code base.
Tree-sitter’s not the only game in town. What it does bring
to the table, and what has eluded most other attempts (in
Emacs and beyond), is that is has the largest repository of
parsers for both common and uncommon languages and
structured text files. Tree-sitter is thus capable and popular.
It helps that it is quite straightforward to write your own
parser using tree-sitter’s tooling. The cherry on top is a
query language to quickly find and match segments of
the parsed tree that it emits. That is perhaps its ace in the
hole: being able to ask it to show you (for example) all
the functions that contain one or more variables with a
given name is a powerful feature indeed. Modeled on LISP’s
S-expressions, the query language also feels right at home
in an Emacs ecosystem.
Presently, the feature is optional, as you must compile
Emacs with tree-sitter support. So it is unlikely to replace,
wholesale, the existing major modes and the old way of
1 My article on How to Get Started with Tree-Sitter will help you
set up your Emacs to use tree-sitter.
11

## [p.12]
Introduction
doing things. But it’s a large step forward for Emacs, as it
makes writing syntax highlighting and indentation code
downright easy2 . Its adoption into Emacs core is a positive
development, and a repudiation against the entrenched
belief that Emacs can never fundamentally change. Font
locking in Emacs was first introduced around 35 years ago,
and now there is a new way – and often much better way –
than the old regular expressions. Its successful integration
into Emacs is also reflected in the wider Emacs community
where it has proven to be a popular feature, despite the fact
that tree-sitter is, being new to Emacs, cumbersome to set
up and use.
The other major inclusion is Eglot, a client that understands
the language server protocol (LSP). Eglot adds IDE-like
features to any buffer for which there is a language server
available. It’s designed to work with nothing more than
base Emacs and the requisite language server. Provided
you’ve got your language server set up, all you need to type
is M-x eglot (or select Tools -> Language Server Support)
to get started. Eglot’s been around for a long time on ELPA,
an Emacs package repository. Now it’s built into Emacs.
Both capabilities are capstones in an otherwise packed
release full of exciting improvements and fixes. If you’re
not using Emacs 29 already, you should definitely upgrade.
2 I wrote an article on writing your own major mode to leverage
tree-sitter in Let’s Write a Tree-Sitter Major Mode.
12

## [p.13]
Introduction
Intended Audience
It’s a bit weird talking about the intended audience when
you’ve already bought the book on the subject. But it bears
mentioning anyway so no matter your Emacs skill level you
will get something out of this book.
The first and (most obvious) audience are people new to
Emacs. If you’ve never used Emacs before in your life, you
will hopefully find this book illuminating. However, if
you’re new to Emacs and non-technical, then you’re going
to have a harder time. Emacs, despite being suitable for
much more than just programming, is squarely aimed at
computer-savvy people. Although it’s perfectly possible
to use Emacs anyway, this book will assume that you’re
technically inclined, but not necessarily a programmer.
If you’ve tried Emacs before but given up, then I hope this
book is what convinces you to stick with it. But it’s fine if
you don’t; some languages or environments don’t (contrary
to what a lot of Emacs users would claim) work well with
Emacs. If you’re primarily a Microsoft Windows developer
working with Visual Studio, using Emacs is going to be a
case of two steps forward, one step back: you gain unprece-
dented text editing and tool integration but lose some of the
benefits a unified IDE would give you.
If you’re a Vim refugee, then welcome to the dark side! If
your primary objective is to use Emacs’s Vim emulation lay-
ers, then some of this book is redundant; it concerns itself
with the default Emacs bindings and it teaches “the Emacs
way” of doing things. But not to worry: a lot of the tips and
advice herein are still applicable, and who knows — maybe
13

## [p.14]
Introduction
you’ll switch away from Evil mode in time.
And finally, if you’re an existing Emacs user but struggling
to take it to the next level, or maybe you just need a refresher
course “from the ground up,” then this book is also for you.
What You’ll Learn
Covering all of Emacs in just one book would be a Sisyphean
task. Instead, I aim to teach you what you need to be produc-
tive in Emacs, which is just a small subset of what Emacs can
do. Hopefully, by the end of this book, and with practice,
you will know enough about Emacs to seek out and answer
questions you have about the editor.
To be more specific, I will teach you, in broad terms, six
things:
What Emacs is about A thorough explanation of impor-
tant terminology and conventions that Emacs uses
which in many cases differs greatly from other editors.
You will also learn what the philosophy of Emacs is,
and why a text editor even has a philosophy. I will
also talk about Vim briefly and the Editor Wars and
what the deal is with all those different keys.
Getting started with Emacs Howto install Emacs, how to
run it, and how to ensure you’re using a reasonably
new version of Emacs. I explain how to modify Emacs
and what you need to do to make your changes per-
manent. I will introduce the Customize interface and
how to load a custom color theme. And finally, I’ll talk
14

## [p.15]
Introduction
about the user interface of Emacs and some handy tips
in case you get stuck.
Discovering Emacs Emacs is self-documenting; but what
does it mean and how can you leverage that aspect
to discover more about Emacs or answer questions
you have about particular features? I will show you
what I do when I have to learn how to use a new
mode or feature in Emacs, and how you can use the
self-documenting nature of Emacs to find things for
which you’re looking.
Movement How to move around in Emacs. At first glance a
simple thing to do, but in Emacs there are many ways
of going from where you are to where you need to
go in the fewest possible keystrokes. Moving around
is probably half the battle for a developer and know-
ing how to do it quickly will make you more efficient.
Some of the things you’ll learn: moving by syntactic
units, and what exactly syntactic units are; using win-
dows and buffers; searching and indexing text; select-
ing text and using the mark.
Editing As in the chapter on movement, I will show you
how to edit text using a variety of tools offered to you
by Emacs. This includes things like editing text by bal-
anced expressions, words, lines, paragraphs; creating
keyboard macros to automate repetitive tasks; search-
ing and replacing; registers; multi-file editing; abbre-
viations; remote file editing; and more.
Productivity Emacscandomorethanjustedittextandthis
chapter is only a taste of what attracts so many people
15

## [p.16]
Introduction
to Emacs: its tight integration with hundreds of exter-
naltools. Iwillwhetyourappetiteandshowyousome
of the more interesting things you can do when you
choreograph Emacs’s movement and editing.
16

## [p.17]
Chapter 2
The Way of Emacs
“The purpose of a windowing system is to put
some amusing fluff around your one almighty
emacs window.”
– Mark, gnu.emacs.help.
If you imagine the span of the modern computing era begin-
ning in the 1960s, then Emacs has been there longer than just
about everything else. It was first written by Richard Stall-
man as a set of macros on top of another editor, called TECO,
back in 1976.1 TECO is now mostly remembered for being
extremely arcane. Since then, there have been many compet-
ing implementations of Emacs but today you’re only likely
to encounter XEmacs and GNU Emacs.
This book will only concern itself with GNU Emacs. Once
upon a time XEmacs was the more advanced and feature rich
1 https://www.gnu.org/software/emacs/manual/html_mono/efaq.
html#Origin-of-the-term-Emacs
17

## [p.18]
The Way of Emacs
editor, but this is no longer the case. I started my Emacs jour-
ney with XEmacs, as it had a large number of novel features
that GNU Emacs did not.
The history of XEmacs and GNU Emacs is an interesting
one. It was one of the first major forks2 in a free software
project. XEmacs spearheaded a lot of features we now take
for granted in GNU Emacs, and its rise in the 90s resulted in a
lot of competition between the two projects, to the benefit
of its users. GNU Emacs’s development began to falter in the
late 90s and early 2000s, but now it’s busier and more active
than it has ever been. Since the late 2000s, development
of XEmacs has declined to the point where it is no longer
maintained.
Note
To almost everyone, the word Emacs refers
specifically to GNU Emacs. I will only spell
out the full name when I am distinguishing
between different implementations. When I
mention Emacs, I always talk about GNU Emacs.
Because of Emacs’s age there are a number of… oddities.
Weird choices of terminology and historical anachronisms
persist because in most cases Emacs was ahead of the
editor-IDE curve for many decades and thus had to invent
its own terminology for things. There are talks of replacing
Emacs’s own vernacular with words familiar to everyone,
but that is still a long way off, if it ever happens.
2 https://www.jwz.org/doc/lemacs.html
18

## [p.19]
The Way of Emacs
Despite the lack of marketing; a small core of Emacs devel-
opers; and the anachronisms and terminology that predates
the modern Personal Computing-era; there are many peo-
ple out there who just love using Emacs. Emacs’s strength is its
ability to adapt: and with that, I mean not only the software,
but the large body of volunteer maintainers and contribu-
tors who set the direction of Emacs. They work tirelessly –
within the constraints of a product that is older than most of
its users – to stay abreast of changes in the wider world. The
myth of an ossified Emacs community and platform are just
that – a myth.
This chapter will talk about the Way of Emacs: the terminol-
ogy and what Emacs means to a lot of people, and why un-
derstanding where Emacs comes from will make it easier to
adopt it.
Guiding Philosophy
Emacs is a tinkerer’s editor. Plain and simple. People
who hack on Emacs do it because almost every facet of
it is extensible. It is the original extensible, customizable,
self-documenting editor. In fact, that is its official tagline.
If you come from other text editors, the idea of being able
to change anything may seem like an unnecessary distraction
from your work – and indeed, a lot of Emacs hacking does
happen at the expense of one’s real job – but once you
realize that you can shape your editor to do what you want
it to do, it opens up a world of possibilities.
That means you can truly rebind all of Emacs’s keys to your
liking; you are not hidebound by your IDE’s undocumented
19

## [p.20]
The Way of Emacs
and buggy API nor the limitations that would follow if you
did change things — such as your custom navigation keys
not working in, say, the search & replace window or in the
internal help files. Truly, in Emacs, you can change every-
thing — and people do. Vim users are migrating to Emacs
because, well, Emacs is often a better Vim than Vim.
Emacs pulls you in. Once you start using Emacs for the edit-
ing, you realize that using Emacs for IrC, email, database ac-
cess, organizing your thoughts, command-line shells, com-
piling your code or surfing the Internet is just as easy as edit-
ing text – and you get to keep your key bindings, theme and
all the power of Emacs and elisp to configure or alter the be-
havior of everything.
And when everything is seamlessly tied together you avoid
the usual context switches of going from application to ap-
plication: most Emacs users use little more than the editor,
a browser and maybe a dedicated terminal application.
Emacs’s history
Emacs’s source code repository (now in Git)
stretches back over 30 years and has more than
130,000 commits and nearly 600 committers.
If you want to modify Emacs, or any of the myriad pack-
ages available to you, Emacs Lisp (also known informally as
elisp) is what you will have to write. There have been a few
attempts to graft other languages onto elisp and Emacs but
with no lasting effect. As it turns out, LISP is actually a per-
fect abstraction for a very advanced tool like Emacs. And
most modern languages wouldn’t necessarily stand the test
20

## [p.21]
The Way of Emacs
of time: TCL was briefly considered in the 90s as it was popu-
lar at the time — but that has the distinction of being even
more obscure than LISP, nowadays.
The only downside is that fiddling with your Emacs config-
uration is something you will have to learn to live with (and
in LISP no less, but as I explain in the next part that’s actually
a good thing.) That’s why I reinforced the point that it’s a
tinkerer’s editor. If you hate the idea of tweaking anything
and want everything to work perfectly out of the box, you
have two options left:
Use a starter kit There are many free starter kits that come
equippedwithadditionalpackagesandwhatitsauthor
thinks are sensible defaults. They can be a good way
to start out but with the caveat that you don’t know
where Emacs ends and the starter kits’ added function-
ality begins.
I recommend you look at one of the following starter
kits:
• Crafted Emacs
https://github.com/SystemCrafters/crafted-emacs
• Steve Purcell’s .emacs.d
https://github.com/purcell/emacs.d
• Bozhidar Batzov’s Prelude
https://github.com/bbatsov/prelude
If you want an opinionated kit with a strong slant to-
wards Vim:
21

## [p.22]
The Way of Emacs
• Doom Emacs
https://github.com/hlissner/doom-emacs
Use the defaults Certainlyanoption,butEmacsshipswith
neutral but old-fashioned defaults. You are expected
to configure Emacs to your liking or let someone else
do the work for you. For an editor that is so radically
different from mainstream editors, the maintainers are
conservative about changing the defaults for fear of up-
setting the old guard (who, of all people, should know
how to configure Emacs.)
Personally, I never used a starter kit – they did not
exist in the same way they do now when I started
nearly 20 years ago – but instead borrowed heavily
from other people’s .emacs files, as we called it back
then.
This approach is well-suited to people who want to
understand their editor end-to-end. I would encour-
age you to at least try a starter kit like Crafted Emacs to
get an idea of how configurable Emacs is, even if you
don’t adopt one. There is always more to learn, and
new things to discover.
LISP?
Emacs is powered by its own LISP implementation called
Emacs Lisp or just elisp. Many are put off or intimidated by
this esoteric language; that’s a shame, because it’s a practical
and fun way to learn LISP in an editor built up around the
idea of LISP as a singular machine. Every part of Emacs
can be inspected, evaluated or modified because the editor
22

## [p.23]
The Way of Emacs
is approximately 95 percent elisp and 5 percent C code.
It’s also a practical way to learn a radical paradigm: that
code and data are interchangeable and malleable; that the
language, owing to its simple syntax, is trivially extensible
with macros.
Unfortunately, there’s no getting around learning elisp at
some point. In this book, I will talk about the Customize in-
terface: a dynamically generated interface of customizable
options in Emacs. However, something as simple as rebind-
ing a key means you’ll have to interact with elisp. But it’s
not all bad. Most of the problems you’re likely to encounter
have already been solved by someone else a long time ago;
it’s a simple matter of searching the Internet for a solution
to your problems.
Despite the relative unpopularity of elisp versus more “mod-
ern” languages like Python, Ruby and JavaScript, I doubt
Emacs would have had the same power of extensibility if
a more traditional imperative/object-oriented language had
been used. What makes LISP such a fantastic language is that
source code and data structures are intrinsically one and the
same: the LISP source code you read as a human is almost
identical to how the code is manipulated as a data structure
by LISP — the distinction between the questions “What is
data?” and “What is code?” are nil.
The data-as-code, the macro system and the ability to “ad-
vise” arbitrary functions – meaning you can modify the be-
havior of existing code without copying and modifying the
original – give you an unprecedented ability to alter Emacs
to suit your needs. What would in most software projects
be considered code smells or poor architecture is actually a
23

## [p.24]
The Way of Emacs
major benefit in Emacs: you can hook, replace or alter exist-
ing routines in Emacs to suit your needs without rewriting
large swathes of someone else’s source code.
This book will not teach elisp in any great detail: Emacs has
a built-in elisp introduction3 and I highly recommend it if
you are curious — and honestly you should be. LISP is fun
and this is a great way to learn and use a powerful language
in a practical environment. Don’t let the parentheses scare
you; they are actually its greatest strength.
Emacs as an Operating System
Emacs is like a magpie’s nest of shiny things. If you’re new to
Emacs you’re thinking I am stretching the simile a bit, but
consider that Emacs comes with a built-in screensaver with
M-x zone; a text adventure game, M-x dunnet; a M-x tetris
clone; a full-blown client-server model; a lunar phases calcu-
lator; a psychotherapist in M-x doctor; several email clients;
an artist mode for drawing ASCII art. There’s even a third-
party EPUB reader, nov, that you can use to read this very
book inside Emacs itself.
When you run Emacs you are in fact launching a tiny C
core responsible for the low-level interactions with your op-
erating system’s ABI. That includes mundane things like file-
system and network access; drawing things to the screen or
printing control codes to the terminal.
The cornerstone of Emacs though is the elisp interpreter —
without it, there is no Emacs. The interpreter is creaky and
old; it’s struggling to meet the growing demands of its users.
3 https://www.gnu.org/software/emacs/manual/eintr.html
24

## [p.25]
The Way of Emacs
Modern Emacs users expect a lot from their humble inter-
preter: speed and asynchrony are the two main issues. The
interpreter runs in a single thread and intensive tasks will
lock the UI thread. There are workarounds, though. The is-
sues, manifold though they are, do not deter people from
writing ever-more sophisticated packages. With the release
of Emacs 28 – and if your instance of Emacs is compiled with
support for it – all elisp code you use is seamlessly compiled
to native code, resulting in significant speedups.
When you write elisp you are not just writing snippets of
code run in a sandbox, isolated from everything — you are
altering a living system; an operating system running on an
operating system. Every variable you alter and every func-
tion you call is carried out by the very same interpreter you
use when you edit text.
Emacs is a hacker’s dream because it is one giant, mutable
state. Its simplicity is both a blessing and a curse. You can
re-define live functions; change variables left and right; and
youcanquerythesystemforitsstateatanytime—statethat
changes with every key stroke as Emacs responds to events
from your keyboard to your network stack. Emacs is self-
documenting because it is the document. There are no other
editors that can do that. No editor comes close.
And yet Emacs never crashes — not really, anyway.
Emacs has an uptime counter to prove that it doesn’t
(M-x emacs-uptime) — multi-month uptimes are common.
So when you ask Emacs a question – as I will show you how
to do later – you are asking your Emacs what its state is. Be-
cause of this, Emacs has an excellent elisp debugger and un-
limited access to every facet of Emacs’s own interpreter and
25

## [p.26]
The Way of Emacs
state — so it has excellent code completion too. Any time
you encounter a LISP expression you can tell Emacs to evalu-
ate it, and it will: from adding numbers to setting variables
to downloading packages.
Extensibility
Extensibility is important, but emphasizing that importance
is difficult if you don’t know the scope of possibilities in
Emacs. I’ve included just a few examples of what Emacs can
do – or more importantly still, what Emacs can enable people
to do – here.
A speech interface for the blind For
25
years,
Emac-
speak4 has offered blind or visually impaired Emacs
users a way of interacting with Emacs, and the world,
through a speech interface that understands the
content of what appears on your screen. Emacspeak
will change the voice characteristics of the speech
engine to reflect different syntactic elements in source
code, or to emphasize layout, fonts or graphical icons.
For blind Emacs users, Emacspeak is a lifeline that has
enabled them to continue working by using Emacs’s
many tools, such as e-mail or web browsing.
The fact that this functionality has been around for 25
years is in itself impressive, but Emacs’s ability to sup-
port this sort of transformational software is beyond
inspiring.
4 https://emacspeak.sourceforge.net/
26

## [p.27]
The Way of Emacs
Remote file editing Emacs’s TrAMP5 seamlessly lets you
edit remote files using a variety of network protocols,
including SSH, FTP, Docker, rclone, rsync, and more,
as though the files were local.
Shell access Emacs has a built-in ANSI-capable Terminal em-
ulator; an Emacs wrapper around shells, such as bash;
and a full-blown shell called Eshell written entirely in
elisp.
Org mode A to-do, agenda, project planner, literate pro-
gramming, note-taking (and more!) application.
GNU Hyperbole A sophisticated hypertext package that
lets you link to, and cross-reference, nearly every-
thing, thanks to its notion of buttons. Buttons are
a form of textual hyperlink that you can use to
action nearly any task, be it links to a bug tracker
or cross-referencing dates, names, emails, and much
more.
It has a sophisticated hierarchical outliner for organiz-
ing and searching, and it plugs into Org mode, letting
you combine Org and Hyperbole into an exception-
ally advanced semantic, hypertext-capable toolset.
Symbolic Calculator Reverse-Polish Notation calculator
capable of symbolic algebra, arbitrary precision com-
putation, custom functions, matrix and unit-based
mathematics, and much more.
Music Player The Emacs Multimedia System (EMMS) is an
interactive media browser and music player.
5 Transparent Remote (file) Access, Multiple Protocol
27

## [p.28]
The Way of Emacs
EGlot A sophisticated client that understands the Lan-
guage Server Protocol (LSP) letting Emacs talk to
any Language Server and offer advanced IDE features
inside Emacs, like code completion, refactoring,
formatting, and linting. It is included in Emacs 29 by
default.
And much more Official or unofficial support for almost
every programming environment; built-in man page
and info reader; a very sophisticated directory and file
manager; seamless support for almost every major ver-
sion control system; and thousands of other features,
large or small.
Important Conventions
There are some important Emacs conventions that I need to
talk about before we continue. It’s quite important that you
memorize them or at least refer back to this page if you’re
in doubt. They will crop up again and again in the book
and elsewhere and knowing them is paramount if you want
to make use of Emacs’s extensive, internal documentation.
This is not an exhaustive list of conventions used in Emacs
or even in this book. I will introduce specific terms and con-
cepts throughout the book, though some terms transcend
specific topics and are therefore important to know before-
hand.
28

## [p.29]
The Way of Emacs
The Buffer
Most text editors and IDEs are filebased: they display text from
a file, and they save the text to a file. That’s it.
In Emacs, all files are buffers, but not all buffers are files. If
you want a throw-away area to temporarily store snippets
from a log file, or manipulate text, or whatever your reason
— you just create and name a new buffer. Emacs won’t hassle
you for a filename. The buffer will exist in Emacs and only
Emacs. You have to explicitly save it to a file on disk to make
it persist.
Emacs uses these buffers for more than just editing text. It
can also act like an I/O device and talk to another process,
29

## [p.30]
The Way of Emacs
such as a shell like bash or even Python.
Almost all of Emacs’s own commands act on buffers. So
when you tell Emacs to, for example, search & replace it
will actually search and replace on a buffer – maybe the
active buffer you’re writing in, or perhaps a temporary
duplicate – and not an opaque, internal data structure like
you might think. In Emacs, the buffer is the data structure. This
is an extremely powerful concept because the very same
commands you use to move around and edit in Emacs are
almost always the same ones you use behind-the-scenes in
elisp. So once you memorize Emacs’s own user commands,
you can use them in a simple function call to mimic what
you’d do by hand.
The Window and the Frame
When you look at a buffer on the screen it is displayed in
a window. But in Emacs, a window is just a tiled portion of
the frame, which is what most window managers call a win-
dow. In Emacs, it is the other way around; and yes, it’s very
confusing.
If you look at the screenshot above, you will see two win-
dows and one frame. Each frame can have one or more win-
dows, and each window can have exactly one buffer.
So, a buffer must be viewed in a window in order to be dis-
played to the user, and for the window to be visible to the
user it must be in a frame.
Note
30

## [p.31]
The Way of Emacs
Think of it as a physical window having a frame,
each frame made up of window panes.
In Emacs, you are free to create as many frames as you like,
and in each frame you’re free to split and tile that frame into
multiple windows. If you use a large screen monitor (and
who doesn’t, these days), it is very beneficial to use Emacs’s
tiling system to show multiple buffers on the screen.
Modeline, Echo Area, and Minibuffer
The figure above is an example of a Terminal Emacs session.
Emacs uses the modeline to communicate facts about Emacs
and the buffer you’re in. The modeline looks like this:
-UUU:**--F3
*scratch*
All
L4
(Lisp Interaction) --
There’s a lot of information conveyed in a fairly small area.
What you should care about to begin with are the name and
modes. In this case, the buffer is named *scratch* and the
31

## [p.32]
The Way of Emacs
major mode is Lisp Interaction. Most editors have a similar
concept known as a status bar.
All sorts of optional information can be displayed in the mod-
eline: laptop battery power, the current function or class
you’re in, what source control revision or branch you’re us-
ing, and much more.
The minibuffer is directly below the modeline and it is
where errors and general information are shown:
-UUU:**--F3
*scratch*
All
L4
(Lisp Interaction) --
M-x insert-hello-world
In this case, I have triggered Emacs’s extended command func-
tionality – indicated by the M-x symbol, a concept that I will
talk about in the chapter on keys – and I’ve typed the com-
mand insert-hello-world into the M-x prompt.
The echo area and the minibuffer share the same spot on the
screen. The minibuffer is nearly identical to a normal buffer:
you can use most of your editing commands, and the one-
line minibuffer will expand to multiple lines if necessary. It
is how you communicate with Emacs: if you want to search
for a string you write the string you want to search for in
the minibuffer. It supports a variety of complex completion
mechanisms to help you find what you need and is a tool
you will use often.
The Point and Mark
The point is just another word for the caret or cursor. The
Emacs documentation is rather inconsistent in its use of point
32

## [p.33]
The Way of Emacs
or cursor; you will see both. Nevertheless, the point itself is
your current position in a buffer. In this book I will use █
to represent the point. Each buffer tracks the position of the
point separately, so if you switch between buffers the loca-
tion of each point is remembered separately.
Note
In Emacs, we talk a lot about a “current buffer”,
which can mean two things – only one of which
is interesting to us, at the present – and that is
whichever buffer has the point (the other case is ba-
sically the same, but involves programmatically
changing the buffer in elisp.) A buffer that has
the point is the current buffer because it is the one
you write and move around in. Only one buffer
can ever be the current buffer at a time, and it is
this buffer that has the point.
The point, in Emacs, has more utility than just acting as
a visual marker for where characters you type end up on
the screen. It is also one part of a duo called the point and
mark. The point and mark represents the boundary for a
region, which is a contiguous block of text, usually, in the
current buffer. In other editors, it is called the selection or
the highlight. Most editors don’t have specific names for the
beginning and end of a region but in Emacs we do, and we’ll
circle back to it in the chapter on Selections and Regions.
Tip
33

## [p.34]
The Way of Emacs
Historically, Emacs did not show you the visible
region on the screen but instead you had to men-
tally visualize it. Long gone are those days. I’ll
occasionally talk about this odd corner of Emacs.
It’s called transient mark mode (or TMM.)
But like the point, the mark is more than what it seems. It
servesas a boundaryfor theregion,yes,butit isalso abeacon
you can use to return to from other parts in the buffer. The
mark is typically invisible.
Killing, Yanking and CUA
The first – and perhaps most abhorrent, to beginners –
deviation from de-facto user interface standards is Emacs’s
clipboard system. Cut, copy and paste are known, almost
universally, to most as Ctrl+x or Shift+Delete; Ctrl+c or
Ctrl+Insert; and Ctrl+v or Shift+Insert, respectively.
In Emacs, the keys and the terminology differ greatly:
killing is cutting; yanking is pasting; and copying is
awkwardly known as saving to the kill ring (or just copy,
informally.)
The reasons, as before, are historical. Most of the keys and
terminology stem from IBM’s Common User Access6 (CUA)
and Apple. But the CUA was introduced in 1987, many years
after Emacs had settled on its own terminology and stan-
dards.
In Selection Compatibility Modes, I will explain how you
can switch to modern clipboard keys, with certain caveats,
6 https://en.wikipedia.org/wiki/IBM_Common_User_Access
34

## [p.35]
The Way of Emacs
and why you shouldn’t do that. Instead, I’ll show you why
Emacs’s system is better for text editing.
.emacs.d, init.el, and .emacs
A favorite pastime of Emacs users is sharing with other
Emacs hackers little snippets of code or customizations that
make their lives easier.
Historically, these settings were kept in a file called
.emacs, but most now keep their customizations in
~/.emacs.d/init.el on Linux and
%HOME%\init.el on
Windows. Since Emacs now writes several more files to
your file system, they are kept in a directory called .emacs.d
to avoid cluttering your home directory.
XDG Support in Emacs 27
Emacs 27 or later now supports the XDG
convention of storing user configuration in
~/.config/emacs/init.el on Linux platforms
that support it.
So, when people talk about their init file, or their “.emacs
file,” or if they tell you to put something in said file, that’s
what they’re referring to. If you are new to Emacs, you
should use ~/.emacs.d/init.el. When you add something
to the file you will need to tell Emacs to run it. There
are many ways of doing this, and I will explain how in
Evaluating Elisp Code, but my preferred recommendation
for beginners is to close Emacs and restart it.
35

## [p.36]
The Way of Emacs
Note
Starter kits in Emacs are common. They’re
community additions to Emacs that bundle
many changes and often depend on third-party
packages. If you use one, you should read their
documentation for best practices on where to
store your own changes.
Emacs will not, with some exceptions, save changes you
make inside it. If you want Emacs to keep changes, you
must do it through the Customize interface. That means it
is your responsibility to save changes you want to keep to.
Likewise, if you made a mistake and broke something in
Emacs, or if you made changes you do not care for, simply
quit and restart Emacs.
Major Modes and Minor Modes
Major modes in Emacs control how buffers behave. So, if
you want to edit Python code and you visit a file in Emacs
called helloworld.py, then Emacs will know, through a cen-
tralized register that maps file extensions to major modes,
that this is a Python file and it should use the Python major
mode. Each buffer will always have a major mode. The major
mode may be basic and offer no font locking (syntax highlight-
ing) and no specific functionality, or it may be the complete
opposite and introduce font locking, an advanced indenta-
tion engine, and specialized commands.
Note
36

## [p.37]
The Way of Emacs
Font Locking is the correct term for syntax high-
lighting in Emacs, and in turn is made up of faces
of properties (color, font, text size, and so on)
that the font locking engines use to pretty-print
the text.
The Emacs terms face and font lock predate the
more common terms you see used elsewhere.
You are free to change a buffer’s major mode at any time by
typing the command for another one. In addition to Emacs’s
register of file extensions and associated major modes, there
is another system for files with ambiguous (or no) file exten-
sions at all: Emacs will scan the first portion of the file and
try to infer the major mode from that. Rarely, Emacs will
get it wrong and you will need to change it.
It’s important to remember that each buffer can have just
one major mode. Minor modes, by contrast, are typically
optional add-ons that you enable for some (or all) of your
buffers. One example is flyspell mode, a minor mode that spell
checks text as you write.
The major mode is always displayed in the modeline. Some
minor modes are also displayed in the modeline, but usually
only the ones that alter the buffer or how you interact with
it in some way.
37

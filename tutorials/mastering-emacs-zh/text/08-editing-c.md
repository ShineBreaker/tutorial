# 编辑理论（三）：键盘宏、文本展开、缩进、排序对齐

> 原书来源：Mastering Emacs (Eli Spare)，第 235–270 页。
> 覆盖范围：Keyboard Macros, Text Expansion, Indenting, Sorting and Aligning, Other Editing

## [p.235]
The Theory of Editing
Emacs to attempt a cleanup of the buffer or region with the
equivalent cleanup commands.
Keyboard Macros
You can record keystrokes and commands in Emacs and
save them for later playback as a keyboard macro. A keyboard
macro in Emacs is very different from a LISP macro and you
should not confuse the two.
Macro recording is not a new invention. Most IDEs and text
editors have it, but few have one as advanced as the one in
Emacs. Emacs’s keyboard macros are especially powerful as
almosteverything isrecorded.Therearefewblindspots–none
of which you are likely to encounter – and that is what sets
it apart from IDEs and their mostly anemic macro recording.
Emacs’s macro recorder is itself written in LISP. That alone
speaks to the power of extensibility that Emacs offers, but it
also reinforces the extent you can inspect and record changes
made at a microscopic and macroscopic level in Emacs.
Basic Commands
Key Binding
Description
F3
Starts macro recording,
or inserts counter value
F4
Stops macro recording
or plays last macro
C-x ( and C-x )
Starts and stops macro recording
C-x e
Plays last macro
235

## [p.236]
The Theory of Editing
You can begin recording with F3 and stop it with F4. The
other two keys are not as accessible and are there for back-
wards compatibility with wizened veteran users of Emacs.
The macro recorder stops when you invoke the universal
quit command, C-g.
Signaling Errors
Occasionally, you may trigger an error in Emacs
and that will also stop recording or playback.
One common “error” is M-g M-n or M-g M-p (go
to next or previous error) when you reach the
beginning or end of the list of errors.
Emacs will then signal an error internally which
may beep or blink your screen, depending on
the fidelity of your system. This will catch you
out if you are not careful; it still happens to me!
It is ultimately a good thing, though: you
can record a macro that invokes the next or
previous error functionality, and then play back
the macro repeatedly: it will signal stop when it
reaches the end (or start) of the list of errors 3 .
When macro recording is in progress you will see, in your
modeline, the word Def. When you finish recording, you
can play it back immediately by typing C-x e or F4.
Recorded macros have their own macro ring, much like
the kill ring, undo ring, and history rings. That means
3 Next and previous error is a bad name for a feature that works with
any auto-generated list, like Occur, Grep, M-x compile, etc.
236

## [p.237]
The Theory of Editing
you won’t have to worry about accidentally overriding a
recorded macro if you start a new one. They are never truly
lost (unless you exit Emacs!) but you can explicitly save
them to disk.
You can also pass the universal argument and digit
arguments to the macro commands:
Key Binding
Description
C-u F3
Starts recording but appends
to the last macro
C-u F4
Plays the second macro in the ring
numeric F3
Starts recording but sets counter
to numeric
numeric F4
Plays last macro numeric times
So, C-u and the digit arguments do different things. Numeric,
in this case, means numbers such as C-u 10 or M-10.
Appending to the last macro (C-u F3) has its place, but pass-
ing a numeric argument to F4 is worth knowing about, as
replaying the macro a set number of times is something you
are more likely to do. By passing digit 0 (C-0 F4 or C-u 0 F4,
for instance) Emacs will run the macro over and over again
until Emacs signals an error, such as reaching the end of a
buffer, or when the recorded macro sends an error signal.
Advanced Commands
There is an entire prefix key group, C-x C-k, dedicated to
Emacs’s macro functionality. There are many commands,
and most of them are rather niche.
237

## [p.238]
The Theory of Editing
Learn more
As always, you can append C-h to a prefix key
and Emacs will list all the keys bound to that pre-
fix. Another way is to list all the commands with
apropos (C-h a).
The naming scheme is somewhat inconsistent. A
lot of the macro commands begin with kmacro.
Some, however, predate that part of Emacs, and
merely contain the word kbd-macro.
Interactive Macro Playback
Let’s start out with the counters. When you start recording,
Emacs will automatically initialize an internal counter to
zero, and every time you press F3 during the recording,
Emacs will insert the counter and then increment the
internal counter by 1. There are, of course, many creative
uses for the counter: creating numbered lists is the most
obvious.
Key Binding
Description
C-x C-k C-a
Adds to counter
C-x C-k TAB, F3
Inserts counter
C-x C-k C-c
Sets counter
C-x C-k C-f
Sets format counter
C-x C-k q, C-x q
Queries for user input while
recording
The counter commands above do more than this. C-x C-k
C-a adds a number to the counter, and, conversely, giving
238

## [p.239]
The Theory of Editing
it a negative number subtracts from the counter. Both F3
and C-x C-k TAB insert the counter value and increments it
by 1, but if you give it the universal argument C-u, it will
insert the last number and not increment the counter. You
should keep that in mind if you need to use the same number
multiple times in a row.
Counter Resets & Registers
Counters are only reset when you explicitly set
them or when you record a new macro. The
counter persists between macro playbacks.
Similarly, you are free to use Emacs’s registers
to track – and add or subtract from – values if
you prefer. They operate independently of the
macro machinery and are not reset when the
macro is.
The command C-x C-k C-c explicitly sets the counter as op-
posed to merely adding to it like with C-x C-k C-a. Finally,
C-x C-k C-f is perhaps the most advanced of the counter
commands. It takes a format string and formats the counter
accordingtothisstring(type C-h f formatformoreinforma-
tion on format strings). So, for instance, you can decimalize
the number or print it with leading or trailing zeros — or
anything similar, like inserting a plain number and text. If
you’re a programmer, and familiar with format strings, sure
you do not wrap the text you pass to C-x C-k C-f in either
single or quotes: Emacs will do that for you.
The standout command is C-x C-k q (or simply C-x q.)
When you call it, Emacs will tag that step in the macro
239

## [p.240]
The Theory of Editing
recording. When you play back the macro, Emacs will stop
at each query point and ask the user for advice – it stops
the macro and asks prompts you for what to do in the
minibuffer – before continuing.
There are a number of options available to you during a
query prompt.
Query Key Binding
Description
y
Continues as normal
n, DEL
Skips the rest of the macro
RET
Stops the macro entirely
C-l
Recenters the screen
C-r
Enters recursive edit
C-M-c
Exits recursive edit
y and n continue or stop the current iteration of the macro. So
if you are executing more than one macro in a row, N would
skip the rest and restart at the beginning of the macro. Y
merely continues on as normal. RET stops the macro entirely
and halts further macro playback.
You can recenter the screen – which is not the same as the
usual C-l command – and Emacs will center the point in the
middle of the buffer.
Recursive Editing
Recursive editing is an advanced topic.
When you enter recursive editing (C-r), Emacs will suspend
any on-going command – such as Isearch, search & replace
or a keyboard macro – and hand control back to you, the
user. You are then free to continue editing and otherwise
240

## [p.241]
The Theory of Editing
use Emacs as you would normally, but at any time you can
type C-M-c and Emacs will snap back to the earlier recursive
step that you entered and resume from then on. You can nest
recursive edits as many times as you reasonably like, and if
you are in recursive editing, you can see it in your modeline
because square brackets ([]) surround the major and minor
mode indicators. You can force Emacs to abandon all recur-
sive editing levels by typing ESC ESC ESC. Note that, unlike
most other things, C-g will not exit out of recursive editing.
So,howdoyouusethisinpractice?Oneexampleisrealizing
during Isearch or macro playback that you need to edit text,
send an e-mail or otherwise temporarily suspend what you are
doing. C-r lets you do that. When you are finished, type C-M-c
to resume where you left off before. Interestingly, the mere
act of recording and playing back a macro is itself something
you can undertake when you enter recursive editing! You
could have a macro that does large sweeping changes, and a
second that you use for finessing things the first macro can’t
do.
Recursive editing is an explicitly supported feature of some
complex, interactive commands – such as Isearch or query
replace – and yet it’s perhaps one of the most under-used
features in Emacs. I would not worry too much about us-
ing recursive editing to start with. If you ever reach a point
where you want to stop an in-progress command, you now
know that you can.
Saving and Recalling
Macros in Emacs are stored in a macroring, a concept that you
should recognize from other parts of Emacs (like the kill ring
241

## [p.242]
The Theory of Editing
and undo ring.) Creating a new macro automatically stores
old macros in the macro ring without you having to do any-
thing. The commands below let you save and recall from the
macro ring, edit and bind macros to keys, and more.
Key Binding
Description
C-x C-k C-n
Cycles macro ring to next
C-x C-k C-p
Cycles macro ring to previous
C-x C-k n
Names the last macro
C-x C-k b
Binds the last macro to a key
C-x C-k e
Edits last macro
C-x C-k l
Edits the last 300 keystrokes
M-x insert-kbd-macro
Inserts macro as elisp
Both C-x C-k C-n and C-x C-k C-p cycle the macro ring.
Emacs will helpfully display a portion of the macro when
you do so you know which one is active.
You can name the macro with C-x C-k n. You must do this
first if you want to save the macro to a file, as you can then
open your init file and call M-x insert-kbd-macro and Emacs
will insert a code-generated version of the macro. Named
and inserted macros turn into commands that you can invoke
with M-x. You can also, temporarily, for the current session
only, bind it to a key with C-x C-k b.
Naming Things
I recommend you pick a consistent naming
scheme. Remember, that you’re creating a
new command in Emacs, and so it’ll appear
242

## [p.243]
The Theory of Editing
alongside all the other commands in M-x. You
can’t use whitespace characters in LISP but you
can use nearly any other character. However, I
always name my personal commands with my
initials mp- so I can combine it with C-h a and
friends. That way I can find all my homegrown
commands with Emacs’s own self-documenting
facilities.
You can edit an existing macro if you made a mistake. The
C-x C-k e command prints a list of macro commands that
you edit as though it were text. You can commit those
changes with C-c C-c.
Lossage
Emacs remembers the last 300 characters and
commands, called lossage, you typed. You can see
this list of characters by typing C-h l. You can
even save every keystroke you make in Emacs
– including sensitive things like passwords, so
beware – by typing M-x open-dribble-file.
Lossage also shows the command the keystroke
belongs to. Things like active modes in the
buffer may change the command a key belongs
to. So keep that in mind if you look up keys
outside of the buffer and modes it was executed
in. Do use the lossage feature when you want to
make a keyboard macro retroactively, as you
can use the command M-x kmacro-edit-lossage
to create a macro derived from your input.
243

## [p.244]
The Theory of Editing
Practical Uses for Keyboard Macros
The first thing that springs to mind when you say keyboard
macro is simple text automation, but Emacs’s macro system
is capable of so much more than that.
One overlooked aspect is the ability to combine a lot of com-
plex tasks and then name & save the macros for reuse later.
On its own that may not be such a surprising or noteworthy
feature, until you realize you can orchestrate a lot of the te-
dium that you’d otherwise need deep Emacs or elisp knowl-
edge (that you may not possess yet!) to accomplish without
a macro.
Configuring your window setup just the way you like it
If you want to open certain files and display them
in a certain orientation, you could do this with a
keyboard macro. Clear the windows first with C-x 1
and then use a macro to open the files you want; split
the windows to your liking and switch them to the
buffers you care about; and then end the macro.
You can now, at will, recall this setup whenever you
want.
Write macros for frequent text editing operations
Maybe you have a selection of text patterns you
want to bulk change, or maybe you want it to be
semi-dynamic, depending on the workload of the
day. You could, for instance, use M-x rgrep to find
a selection of files that need changing, and use a
keyboard macro to step through each entry in the
*grep* buffer and apply a search & replace pattern.
244

## [p.245]
The Theory of Editing
Simply start recording and type M-g M-n to pick the
next match from whatever source Emacs is drawing
its results from; carry out your text editing; and
then end the recording. Every macro invocation with
C-x e will now process one entry at a time, and it’s
generic enough that you could swap out grep for
occur, M-x compile, and any other source that makes
use of M-g M-n / M-g M-p.
Defer complex decisions to a human You
can
insert
query steps with C-x C-k q, so if you know you have
ambiguous or complex choices before the macro can
proceed, you can liberally intersperse them at key
points in your macro and decide if you should quit
out of the macro; skip the change; or enter a recursive
edit layer to manually edit the buffer before you
continue with the macro. You could even move point
around, or change the buffer text before resuming.
Call macros from macros You can call macros from
macros: so why not create small, reusable pieces of
macro logic and then make a macro that calls out to
these macros. Once named – and even if they’re not,
using the macro ring – you can recall them at will.
Filling out prompts with sensible defaults If you find
yourself repeating the same commands over and over,
you can wrap them in a quick keyboard macro.
You can even insert query markers in prompts and
use it to override whatever you entered as the default
during the recording by entering recursive editing
with C-r; change what you typed in the prompt; and
245

## [p.246]
The Theory of Editing
then return to the macro when you are finished with
C-M-c. Emacs will seamlessly let you amend a live
macro; even if it’s in a prompt.
Prompts are shown in the minibuffer, which indeed is
also a buffer. This again highlights the symmetry and
reuse of concepts throughout Emacs.
Macros are well worth learning and, as you can see, can serve
as a flexible work-around when you don’t know how to
solve a problem with elisp or customizations alone. Just re-
member that if you can do it as a human by interacting with
Emacs, you can record a macro and have Emacs repeat it.
Text Expansion
Thereareseveralbuilt-intools–andjustasmanythird-party
ones – in Emacs that expand text. All of them serve a slightly
different purpose, but the goal is to minimize typing and
maximize automation.
Here are some of the ones available to you in Emacs:
Abbrev Expands abbreviations – such as func into function
– on a per-mode or global level. A very simplistic
expansion mechanism, its main advantage is that
it silently whiles away as you type, fixing typos
or expanding abbreviations. There is, like a lot of
Emacs’s other features, little graphical ceremony: no
whirligig graphics or other visual clutter to distract
you when it expands a keyboard shortcut — in fact,
246

## [p.247]
The Theory of Editing
it’s unlikely you’ll notice at all unless you are looking
for it.
You would typically use this for unambiguous correc-
tions such as correcting typos.
DAbbrev, or dynamic abbreviations Similar to Abbrev
but it expands the previous word by dynamically
looking for things the word at point might expand
into. For instance, typing func in a buffer where
you have a lot of function definitions and DAbbrev
will expand it to function automatically when you
manually trigger the expansion mechanism.
Hippie expand A super-charged DAbbrev-replacement
that expands more than just words, but whole lines,
lisp symbols, Abbrev abbreviations, file names and file
paths. This feature is exceptionally powerful and it’s
a drop-in replacement for Emacs’s default DAbbrev
that also ships with Emacs.
Skeletons A complex templating tool that combines sim-
ple elispprimitives–prompts,regionwrapping,inden-
tation and point positioning – with Abbrev-like expan-
sion.
Although it has been a core part of Emacs for more
than 20 years, few use it. It’s a shame, really, as it’s very
powerful, but it requires patience or elisp knowledge
to use so almost no one does.
Tempo Yet another templating tool that ships with Emacs.
It is similar to Skeletons.
247

## [p.248]
The Theory of Editing
YASnippet A third-party package templating tool inspired
by the text editor TextMate’s template tool — and
TextMate itself borrowing heavily from other tools
before it. It uses a simple template language to create
snippets that you can trigger – with tab or space – and
expand into editable templates. It’s similar to Skeletons
but arguably much easier to use.
Autoinsert Inserts templates – much like skeletons – when
you create a new file that matches a certain file type.
It’s great when you want to auto generate boilerplate
content in a file, such as HTML tags like html, head, and
so on.
Of all the choices above, I would focus my attention on
YAsnippet for templating, as it comes with a large array of
snippets for many major modes and Hippie Expand since it’s
a great productivity booster.
Neither Tempo nor Skeletons are worth learning today unless
you prefer a lisp-based approach to templating your snippets.
Abbrev is only suitable for word replacements as it lacks the
facilities of the more advanced text expansion tools I talked
about above. When you have integrated YASnippet and Hip-
pie Expand into your workflow, you can add Abbrev and Au-
toinsert if you feel you need them.
Abbrev
Abbrev is the perfect tool for auto-correct-style features in
word processors. I use it to replacecommon misspellings and
248

## [p.249]
The Theory of Editing
to replace words like resume with résumé. However, it is un-
questionably the wrong tool for the job if you want to use it
for more advanced things, such as complex text expansions
you would use in software development.
Part of what makes abbrev effective is that it is simple: it ex-
pands words without visual distractions — in fact, I rarely
notice that it corrects words.
Key Binding
Description
C-x a l
Adds mode-specific abbrev
C-x a g
Adds global abbrev
C-x a i l
Adds mode-specific inverse abbrev
C-x a i g
Adds global inverse abbrev
When you add an abbrev with C-x a g or C-x a l, Emacs
will look at the word before point and use that as the replace-
ment word — that is, and I get confused myself, the word
you want it expanded to and not the trigger word. So, to replace
resume with résumé, you would type résumé and place your
point after the word and type, say, C-x a g and enter resume.
When you press SPC after typing resume, Emacs will replace
it with résumé.
The inverse commands do the opposite. You type the word
resume, enter C-x a i g, answer résumé and Emacs will ex-
pand resume into résumé.
DAbbrev and Hippie Expand
Hippie Expand is great. It has an almost preternatural ability
to expand the text at point into what you mean.
249

## [p.250]
The Theory of Editing
Before I talk about Hippie Expand, let’s talk about how you
use DAbbrev, its lesser cousin and the default dynamic ab-
breviation tool in Emacs:
Key Binding
Description
M-/
Expands word at the point
C-M-/
Expand, then show completions
The key, M-/, is easy to type and repeated presses will cycle
through the list of choices. Repeat the command enough
times and it will revert back to the original word. And if
there are many choices to choose from, the C-M-/ command
will attempt to complete as much as it can and display a list
of completions if there is still more than one choice.
DAbbrev is not smart. It looks at other words in your buffer
and it attempts to complete the word at the point to one of
those. That does not make it useless – it has its place – it’s
just that Hippie Expand is so much better.
To use Hippie Expand effectively, you should replace DAb-
brev as the two – though it’s possible to use both – really
don’t complement one another at all. Add this to your init
file to switch to Hippie Expand:
(global-set-key [remap dabbrev-expand] 'hippie-expand)
Hippie Expand expands more than just words. The variable
hippie-expand-try-functions-list is an ordered list of ex-
pansion functions Hippie Expand will call with the text at
the point when you call M-/.
250

## [p.251]
The Theory of Editing
What I like most about Hippie Expand is the file name com-
pletion. It works exactly like your shell’s TAB-completion:
you type M-/ and Hippie Expand will try to complete the
filename or directory at the point. If you ever find yourself
inserting absolute paths or relative file names in code, config-
uration files or documentation — Hippie Expand will make
your life much easier.
Another great feature is its ability to complete whole lines.
It will fall back to word completion if it runs out of ideas,
and if you regularly write elisp, then Hippie Expand will
guess if the text at the point is a potential elisp symbol and
automatically complete it for you also.
As with DAbbrev, repeated calls to M-/ cycles through all the
potential matches, but C-M-/ only shows completions found
by DAbbrev — there is no equivalent completion list for
Hippie Expand.
Actively using M-/ takes a bit of practice. You’ll have to de-
velop an affinity for the sort of expansion rules that apply
when you call it. Learning Hippie Expand is so worth it since
it is a great time saver.
Customizing Hippie Expand
You can alter how Hippie Expand expands text. To do this,
customize the variable hippie-expand-try-functions-list,
but you have to know the name of the try function if you
want to add a new one.
To find a list of try functions, you should:
251

## [p.252]
The Theory of Editing
• Readthecommentaryinthesource(M-x find-library,
then enter hippie-exp and read the documentation).
But how do you find the library name? A good place
to start is to describe the command – hippie-expand
– and Emacs will tell you the name of the library
where it found the symbol. That’s my preferred
approach when I’m exploring, as I’ll probably want
to read the documentation string anyway. If you
just want to visit the location of the function, try
M-x find-function, if you know the name of the
function; or, M-x find-function-on-key, if you know
its key binding.
• Use
Apropos.
Look
at
the
names
of
the
try
functions and search for likely functions using
M-x apropos-function.
I recommend you use both methods. They are likely to yield
different answers. The commentary is rarely up to date, and
purely looking at the code means you may miss things that
are defined elsewhere. The apropos method, meanwhile, is
only useful if you know the name of something, and if the
things you want are similarly named.
Indenting Text and Code
When new programming languages appear, a major mode
for Emacs that does basic syntax highlighting and indenta-
tion appears almost immediately. Part of what makes that
possible is the ability to not only inherit (or re-use) indenta-
252

## [p.253]
The Theory of Editing
tion engines from other major modes but also the generic
indentation engines present in Emacs.
By default Emacs will attempt to indent according to the
rules governed by the major mode you are using. In older
Emacs versions,you had to tell it to do this, as it wouldrarely
do it by default — a frustrating experience for new users. It’s
no longer a problem today. Emacs will apply indentation au-
tomatically using a facility known as electric indentation. You
can customize electric-indent-mode if you want to turn it
off.
Exactly how the indentation engine works is determined by
the major mode — and the whims and personal tastes of
its creators. You may find how it indents is not to your lik-
ing; especially if you’re writing in a C-like language. You
will have to consult Emacs’s manual (if the major mode ships
with Emacs) or possibly the documentation or commentary
in the source files. Emacs does not have a one-size-fits-all ap-
proach to customizing the indentation: you’ll have to refer
to the documentation for instructions on how to do this.
TAB: Indenting the Current Line
When you press TAB, Emacs usually calls indent-for-tab
-command, a generic proxy command that either indents your
code or attempts to TAB-complete the word at the point.
Key and Command
Description
TAB
Indents line using major mode’s
indentation command
M-i
Inserts spaces or tabs to next
253

## [p.254]
The Theory of Editing
Key and Command
Description
tab stop
M-x edit-tab-stops
Edits tab stops
Some major modes override the
TAB key and instead
call their own specialized indent command — one ex-
ample is the C major mode. However, pressing TAB (or
M-x indent-for-tab-command) will, if its heuristic deter-
mines that it should indent, call the indentation function
stored in the variable indent-line-function. The advantage
here is the generic nature of indent-for-tab-command —
it’s just there to pass on the work to either a completion
command or an indentation command.
The variable tab-always-indent governs Emacs’s behavior
when you press TAB. Usually, it just indents but it also has
a completion mechanism, though seldomly used.
Disabling tab characters
If you dislike the use of tab characters, and
if you prefer space, customize the variable
indent-tabs-mode.
Finally, when Emacs indents it calls the aforementioned
function in indent-line-function. The default function is
indent-relative, a command that inserts an actual tab char-
acter. Modes such as text-mode and fundamental-mode (the
default mode for a new, empty buffer) use indent-relative.
Most programming modes do not.
254

## [p.255]
The Theory of Editing
Changing the amount of indentation
The variable tab-width controls how many char-
acters of spacing each tab uses. It also controls
the amount of whitespace to use if you disabled
indent-tabs-mode.
There is also the concept of tab stops in Emacs and you
can edit the tab stops by typing M-x edit-tab-stops and
inserting : characters where you want Emacs to set the tab
point. Subsequent calls to M-i (which calls the command
M-x tab-to-tab-stop) then insert tab stops, by way of
whitespace and tab characters.
Indenting Regions
Regions are even more difficult to indent. How do
you safely indent a region of Python code when block
indentation determines program flow? The answer is —
you don’t. There are two types of region indentation
commands: “intelligent” ones that ask your major mode’s
indentation engine for advice – something that works well
with languages like HTML or C – and plain, fixed-width
indentation for the rest.
Key and Command
Description
TAB
Indents a line or region as
per the major mode
C-M-\
Indents using major mode’s region
indent command
C-x TAB
Rigidly indents
255

## [p.256]
The Theory of Editing
Inanidealworld,pressing TABwithanactiveregionisallyou
need to re-indent it. Unfortunately, Emacs might not sup-
port that, or in some programming languages it is not physi-
cally possible to determine the correct indentation. Pressing
TAB follows most of the same rules as line indentation: Emacs
attempts to indent according to the indent-line-function
and it falls back on simply inserting TAB characters (or whites-
pace, if you disabled indent-tabs-mode).
Typing C-M-\ explicitly indents the region; for some modes
itworksidenticallyto TABandinothersitdoesn’t.Ifyougive
the command a numeric argument, it will indent the region
to that column (i.e., the number of characters) and Emacs
will also use your fill prefix (if you have one) and fill the text
accordingly. C-M-\ is worth your time, as it respects your fill
prefix. However, if you want to indent a fixed number of
columns, you should use C-x TAB.
C-x TAB explicitly indents the region a certain number of
columns. It also takes negative and numeric arguments.
However, if you don’t pass an argument, Emacs will
enter an arrow-key-driven indentation mode that lets
you interactively indent the region with S-<left> and
S-<right>.
Sorting and Aligning
Both sorting and aligning text are common enough actions
that Emacs has its own set of commands that do both.
256

## [p.257]
The Theory of Editing
Sorting
Sorting in Emacs works a lot like the command line utility
sort. All commands sort lines, except the lone paragraph com-
mand.
Command
Description
M-x sort-lines
Sorts alphabetically
M-x sort-fields
Sorts field(s) lexicographically
M-x sort-numeric-fields
Sorts field(s) numerically
M-x sort-columns
Sorts column(s) alphabetically
M-x sort-paragraphs
Sorts paragraphs alphabetically,
M-x sort-regexp-fields
Sorts by regexp-defined fields
lexicographically
M-x sort-lines sorts in ascending order, but if you call it
with a universal argument it will reverse the sort order.
When you sort by line, Emacs will call out to sort (as it is
much quicker) unless you are on Windows, in which case
Emacs does it internally.
Lexicographic and numeric
Lexicographic sorting is how most sorting
algorithms typically work. They look at the
character code for each character and sort by
those. That works fine for most things, except
numbers. Lexicographically, the number
4
comes after the number 23 because the ordinal
of 4 is greater than the ordinal 2 in 23.
257

## [p.258]
The Theory of Editing
To sort your numbers correctly, you must use
M-x sort-numeric-fields.
You can sort lexicographically or numerically using
M-x sort-fields and M-x sort-numeric-fields. You must
pick a column though. To do this, pass a numeric argument
(starting from 1) to sort by that column. Columns are
whitespace-separated; one or more whitespaces together
signify a column delimiter.
So to sort the third column, type M-3 M-x sort-fields. You
can only sort by one column, and as I mentioned earlier,
each column must be whitespace delimited. To alter the col-
umn delimiter, you must use M-x sort-regexp-fields.
Sorting by columns with M-x sort-columns is the only way
to sort by more than one column, and then only successive
columns. To use it, place the point and mark in the begin-
ning and end columns you want to sort and all lines from
point to mark are then sorted.
If you find yourself in need of sorting things not delimited
by whitespace, you have to use M-x sort-regexp-fields.
This command is rather complicated as it requires a good
working knowledge of elisp; it is also easy to only partially
sort a region and that will mess up your text.
Consider this CSV file of products:
Price,Product
$3.50,Cappuccino
$4.00,Caramel Latte
$2.00,Americano
258

## [p.259]
The Theory of Editing
$2.30,Macchiato
...
You cannot sort this data with the other sort commands as
they won’t work at all; the data is not whitespace-delimited.
To sort this, we need M-x sort-regexp-fields.
Emacs’s internal sort routine needs a key – that is, what it
uses to sort, such as a field – and a record, which is typically
the whole line.
Here is how to sort the example above:
M-x sort-regexp-fields
Record: ^\([^,]+\),\([^,]+\)$
Key: \1
This first defines the record as two capturing groups, one for
each column, separated by a comma. The next step is to pick
the key – in this case, the first column containing the price
– to sort by.
The result looks like this:
Price,Product
$2.00,Americano
$2.30,Macchiato
$3.50,Cappuccino
$4.00,Caramel Latte
259

## [p.260]
The Theory of Editing
Sorting by regular expression is not something you will
need to do often, but when you do, it is a powerful tool.
One important caveat is that it is possible to partially sort a
line; if your search term looks like this:
M-x sort-regexp-fields
Record: ^\([^,]+\)
Key: \1
And if you sort the original text, the output looks like this:
$2.00,Cappuccino
$2.30,Caramel Latte
$3.50,Americano
$4.00,Macchiato
Note that we have sorted the first column, yes, but the second
column remains unchanged! That is to say, we have sorted the
prices but not the associated products. Be careful.
Aligning
Text alignment in Emacs encompasses both justification and
columnated text. In fact, the alignment engine in Emacs is so
sophisticated that it is able to automatically align and justify
code based on regexp patterns.
260

## [p.261]
The Theory of Editing
Command
Description
M-x align
Aligns region based on align rules
M-x align-current
Aligns section based on align rules
M-x align-regexp
Aligns region based on regexp
The alignment commands work on regions, which by now
you are familiar with; or sections, a made-up concept unique
to some alignment commands like M-x align-current. A sec-
tion is a group of consecutive lines for which the first matching
alignment rule applies. So, if there is a rule that aligns string
constants – like = in HELLO_WORLD_CONST = "Hello World"; –
then its section would be all consecutive lines that match
that rule.
There are many built-in alignment rules in Emacs, and when
you call M-x align on a region of text, Emacs scans the align-
ment rule list and finds the first one that matches all the cri-
teria in the rule list: major mode, alignment regexp to try
and align, and so on. Unfortunately, the alignment rules
are hard to read and understand, and in practical terms that
means the feature is not as helpful as it could be. Each align-
ment rule in Emacs – stored in align-rules-list – requires
a deep knowledge of regexp and a desire to peel apart the lay-
ers and figure out how the rule works. The Emacs maintain-
ers missed an opportunity here by not requiring doc strings
for every alignment rule that explain how they work.
The benefit of M-x align-current is that you don’t have to
mark a region first. It figures out from the line the point is
on what rule applies and applies it to neighboring lines too
(if they also match that rule).
261

## [p.262]
The Theory of Editing
Here are some of the built-in rules in Emacs, organized by
major mode:
Python You can columnate assignments like so — notice
the alignment of =:
UNIVERSE_ANSWER_CONST = 42
UNIVERSE_QUESTION
= "What is The Answer ..."
Lisp You can columnate alists in much the same way as the
Python example above:
((universe-answer
. 42)
(universe-question . "What is The Answer..."))
In both cases, I had my point on either line and typed
M-x align-current and Emacs figured out which rule to
apply.
Despite the utility of automatic alignment, it is unlikely
your scenario perfectly matches any of Emacs’s alignment
rules. For all other instances, you have to use Emacs’s
flexible M-x align-regexp and tell Emacs how you want
your text aligned.
There are two modes of operation when you use
M-x align-regexp: novice mode, which is what you see
when you run the command; and complex mode, when you
call it with C-u. The only situation wherein you are likely
to truly use the complex mode is when you want to do
multi-column alignment on the same line. Annoyingly,
that feature is not available in novice mode.
262

## [p.263]
The Theory of Editing
Consider the following text:
Cappuccino $2.00
Caramel Latte $2.30
Americano $3.50
Macchiato $4.00
To columnate the text and align the prices on the $ with
M-x align-regexp:
Align regexp: \$
And the output:
Cappuccino
$2.00
Caramel Latte $2.30
Americano
$3.50
Macchiato
$4.00
It gets harder if you want to align multiple columns. Con-
sider this CSV text:
Price,Product,Qty Sold
$2.00,Cappuccino,289
$2.30,Caramel Latte,109
$3.50,Americano,530
$4.00,Macchiato,20
To columnate all three columns, you must use the complex
mode. So, type C-u M-x align-regexp. The first thing you
will notice is the prefilled suggestion:
263

## [p.264]
The Theory of Editing
Complex align using regexp: \(\s-*\)
The regexp matches – in a capturing group – zero or more
whitespace characters. The reason it does this is because a
file you want to align may have plenty of whitespace already
(perhaps you aligned it a short while ago and because you
changed the text it is now misaligned) so Emacs has to
match and capture existing whitespace around the character
you want to align, and then re-align it correctly. When you
use novice mode, Emacs automatically inserts that regexp
before the character you want to align by; that means any
whitespace before your alignment character is removed —
so even in novice mode, the whitespace capturing group is
there.
So, to columnate on ‘,’ you must add ‘,’ to the beginning
or end of the existing regexp. Where you put it alters the
alignment outcome:
Put it before and Emacs will insert spacing to columnate
after the ‘,’.
You may want to do this with a symbol like ‘,’. If you
don’t, it will look like this:
Fooooo ,Bar
Bizz
,Buzz
Put it after and Emacs will insert spacing to columnate be-
fore the ‘,’.
You may want to do this with a symbol like $. If you
don’t, it will look like this:
264

## [p.265]
The Theory of Editing
Foobar Widget $ 15.00
Fizz Buzz $
10.00
So, for this, you want to answer the prompt like so:
Complex align using regexp: ,\(\s-*\)
Next, pick the default answer:
Parenthesis group to modify (justify if negative): 1
There is only one capturing group, though for complex
alignment operations you may well have more than one
group.
Finally, the spacing. Emacs will use align-default-spacing
which defaults to the tab stops Emacs uses internally. It is
usually safe to leave this to its default, but you can enter a
number of absolute spacing and Emacs will try to follow it:
Amount of spacing (or column if negative): 1
Next – and this is the one you are likely to actually care
about – is whether Emacs should repeat the command
throughout the line. Answer yes if you want Emacs to
columnate all the ‘,’ symbols:
Repeat throughout the line: yes
The output now looks like this:
265

## [p.266]
The Theory of Editing
Price, Product,
Qty Sold
$2.00, Cappuccino,
289
$2.30, Caramel Latte, 109
$3.50, Americano,
530
$4.00, Macchiato,
20
Emacs’s align commands are powerful and practical if you of-
ten deal with unformatted text or code. The only downside
is that you have to wade through the complex mode to repeat
the alignment process more than once on a single line.
Note
Earlier on, I said that you may want to automate
complex commands you frequently use with
macros — this would surely be one of those
instances!
Other Editing Commands
Zapping Characters
Kill commands work well on structured text; they act
on syntactic units. But sometimes you want to kill to an
arbitrary character. The zap command, M-z, does just that.
When you invoke it, you are asked for a single character,
ahead of the point. Zap then kills up to (and including) the
character you typed:
http://www.example.com/█articles/?id=10
266

## [p.267]
The Theory of Editing
After zapping to /:
http://www.example.com/█?id=10
And like the kill commands from earlier, it also appends to
the kill ring. Therefore, you can combine it with both kill
commands and negative & numeric arguments to control the
amount of sequential zaps to do, and the direction to do it
in.
Zap up to char
In Emacs 28, this command is now built in, but
it is not bound to anything by default.
One possible key binding is M-S-z:
(global-set-key (kbd "M-S-z") 'zap-up-to-char)
But you can remap M-z if you prefer zapping up
to the character:
(global-set-key [remap zap-to-char]
'zap-up-to-char)
Spell Checking
There are several ways of spell checking in Emacs, and
they all serve different use cases. Spell checking in Emacs is,
surprisingly, not performed by Emacs itself. For Linux, the
choices are aspell and ispell and Emacs will choose aspell
over ispell as it is faster and more modern.
267

## [p.268]
The Theory of Editing
Keys and Commands
Description
M-$
Spell checks word at the point
M-x flyspell-mode
Minor mode that highlights
spelling errors
M-x flyspell-prog-mode
As above, but only highlights text
such as comments and strings
M-x ispell-buffer
Runs spell check on buffer
M-x ispell-region
Runs spell check on region
Regardless of which spell checker you use, both are referred
to as ispell in Emacs.
Spell checking on Windows
You need to install4 either hunspell, aspell or
ispell executables on Windows yourself for
this functionality to work. I recommend you
use hunspell as it is still updated regularly.
I use M-$ frequently for offhand corrections. When you use
it, Emacs will tell you if it thinks it is correct or not. If Emacs
thinks it is wrong, it will list suggestions to choose from and
Emacs will replace the original word.
Flyspell mode works identically to the inline spell checker
inwordprocessors—misspelledwordsarehighlightedwith
squiggly lines. However, that mode is designed for text and
not code; for code, use M-x flyspell-prog-mode as it limits
spell checking to just your comments, strings and doc strings.
Again, a very nifty feature.
4 ASpell can be found here http://aspell.net/win32/.
268

## [p.269]
The Theory of Editing
If you enable either Flyspell minor mode, it also enables a
secondary command bound to C-M-i (and C-.) that auto cor-
rects the word at point. It picks the first likely match and cor-
rects the word at the point; subsequent calls cycle through
the words — much quicker than M-$ as it insists on asking
you which correction you want.
Customize I recommend you customize this feature if you
use it a lot — particularly if you have specific dictio-
nary requirements other than the default one used by
customizing the group ispell.
Dictionary Lookup
Emacs 28 adds support for dictionary lookups if you either
host your own server, or consent to sending the word re-
quest to dict.org. The remote server is surprisingly feature
rich and supports a range of languages.
Commands
Description
M-x dictionary-lookup-definition
Looks for the word
at point
M-x dictionary-search
Searches for a given
word
M-x dictionary-select-dictionary
Selects the dictionary
to search
269

## [p.270]
The Theory of Editing
Quoted Insert
If you ever find yourself in need of inserting a literal TAB, RET
or ASCII control code character, then you need quoted insert,
bound to C-q.
Line feed vs carriage return
If you want to insert a literal newline symbol,
type C-q C-j as that is the newline – LINE FEED
– symbol and not your return key (which is a
CARRIAGE RETURN.)
Quoted insert is clever enough to highlight ASCII control
codes using the face escape-glyph5 so you can spot them
visually. Quoted insert does a literal insert of any character
you feed it — for example, C-q ESC inserts the ASCII control
code ^[, also known as ESCAPE.
5 Which,
as
you
may
recall,
you
can
customize
with
M-x customize-face.
270

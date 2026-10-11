# 移动理论（一）：基础、窗口、标签页

> 原书来源：Mastering Emacs (Eli Spare)，第 85–113 页。
> 覆盖范围：The Theory of Movement / Basics, Window, Frame, Tab Bars

## [p.85]
Chapter 4
The Theory of Movement
Escape Meta Alt Control Shift
– info.gnu.emacs
Getting around, and getting around efficiently, is as impor-
tant as knowing how to edit text quickly and efficiently.
But movement in Emacs is more than characters in a
buffer; there’s a host of supplementary skills that make up
navigation, like understanding Emacs’s rather complicated
windowing system.
I wouldn’t expect you to remember and apply everything
you learn here right away. I’ve laid things out so you can
start at the beginning and work your way through, picking
up bits and pieces as you read. The most important part, as
I’ve stressed many times, is to give it time and practice —
take a moment in your day-to-day life to ask yourself if
there’s a better way of solving a problem.
85

## [p.86]
The Theory of Movement
Movement in Emacs is local, regional or global. Local move-
ment is what you do when you edit and move around text
near to the point. A syntactic unit – a semi-formal term for
commands that operate on a group of characters – is a char-
acter, word, line, sentence, paragraph, balanced expression,
and so forth. Regional and local movement are similar but
regional movement involves whole functions or class defi-
nitions, if you are writing code; or chapters and such con-
structs, if you are writing prose. Global movement is any-
thing that takes you from one buffer to another, or from
one window to the next.
The first thing a beginner sees is Emacs’s penchant for creat-
ing windows: when you view a help file, when you compile
a file, or when you open a shell. If you have never used a
tiling window manager (for that is exactly what Emacs is),
the idea of splitting and deleting windows may seem strange
— in other editors you may use split panes but you almost
never change it to suit the task at hand.
In Emacs, windows are transient; they come and go as you
need them. You can save your window configuration (and
there are several ways of doing this) but they were never
meant to be immutable, like so many editors — set once and
then never changed again. You have to get used to this. Now,
there are many variables you can use to fine-tune Emacs’s
windowing behavior, but you can’t really tweak your way
out of using Emacs’s windows. Some packages try to replace
windows with frames, with some success, but they are essen-
tially hacks and I would recommend you avoid using them
at least until you’re comfortable with Emacs’s system.
Buffers are rarely killed (that is, closed) when they are no
86

## [p.87]
The Theory of Movement
longer needed; most Emacs hackers will simply switch away
to something else, only to return to it when needed. That
may seem wasteful, but each buffer (aside from assorted
metadata and the buffer’s particular coding system) is only
slightly bigger than the byte size of the characters in it. A
typical Emacs session lasts weeks between restarts and most
Emacs hackers have many hundreds of buffers running
without issue.
No matter the task you’re doing in Emacs, you will need to
contend with the notion of buffers and windows and how to
handle them. Thankfully, that can be as easy or as complex
as you like. Emacs responds to how you use and configure
it.
The Basics
By the way
Have you re-mapped Caps Lock yet? Read Caps
Lock as Control to understand why this is so im-
portant.
Learning the basic key bindings to find and save files, change
buffers, and the bare essentials of day-to-day use is the first
step on the path to mastering Emacs. However, you’re free
to use the menu bar to do this until you have committed
the keys to memory. One important thing to note about the
menu bar is that it won’t be clickable in a terminal unless you
set M-x xterm-mouse-mode. The alternative is to press F10 to
activate and navigate the menu bar with the keyboard.
87

## [p.88]
The Theory of Movement
Note
Like I explained in Getting Help, If you don’t
see a menu bar(it should appear in both GUI and
Terminal Emacs) and you have made changes to
Emacs’s configuration – for instance, a starter kit
or a colleague’s init file – you can show it by typ-
ing M-x menu-bar-mode but you still need to track
down the part of your configuration where it’s
hidden.
Once you’re a legendary Emacs hacker, you will naturally
want to hide it as it takes up valuable screen real estate. Un-
til then, please leave it enabled. I encourage you to leave it
enabled until you are confident enough in your Emacs skills
that you no longer need it.
Most major modes have their own menu bar entry as well,
improving the discoverability of the major mode. I used the
menu bar for a long time when I was starting out, and it
really helped me as I could focus on remembering important
commands like navigation and editing.
If you prefer a keyboard-only approach, there are a handful
of key bindings you must know to carry out basic tasks in
Emacs.
Key Binding
Purpose
C-x C-f
Find (open) a file
C-x C-s
Save the buffer
C-x b
Switch buffer
C-x k
Kill (close) a buffer
C-x C-b
Display all open buffers
88

## [p.89]
The Theory of Movement
Key Binding
Purpose
C-x C-c
Exit Emacs
ESC ESC ESC
Quit out of prompts,
regions, prefix arguments and
returns to just one window
C-/
Undo changes
F10
Activates the menu bar 1
Emacs will guess the right major mode when you open files
based on its extension (and if that fails, by the content of
the file) and more or less work out of the box. Aside from
the key bindings above, you can start editing and moving
around with just the arrow keys like other editors.
Let’s talk about each command in turn as their simple actions
belie their complexity.
C-x C-f: Find file
Opening a file in Emacs is called finding a file or even visit-
ing a file. Having said that, it’s perfectly fine to say open also.
The reason is that Emacs really doesn’t distinguish between
opening an existing file and creating a new file. I use the terms
interchangeably.
So, if you type C-x C-f and enter /tmp/hello-world.txt,
Emacs will visit it, whether it’s there or not; if it isn’t, an
empty buffer is shown instead.
1 Required in Terminal Emacs
89

## [p.90]
The Theory of Movement
Major mode load order
When you visit a file, Emacs will pick a major mode. Most
editors make a lot of assumptions about file extensions that
you cannot easily change. Emacs supports an array of detec-
tion mechanisms that can all be changed to suit your needs.
They are listed here in the order they are applied.
File-local variables are variables that Emacs can enable per-
file if they are present in the file. They can appear as
headers:
-*- mode: mode-name-here; my-variable: value -*-
or footers:
Local Variables:
mode: mode-name-here
my-variable: value
End:
Emacs will also look at commented lines using that ma-
jor mode’s comment syntax.
It is worth knowing that file variables read into Emacs
are local to that file’s buffer (meaning other buffers are
unaffected by it.) That means if you have particular
settings that apply only to that file, you can add them
to the header or footer and Emacs will load them au-
tomatically. In practical terms, that means everything
from indentation settings to more complex variables
are controllable from file variables.
90

## [p.91]
The Theory of Movement
Because Emacs is in effect running code straight from a
file, all Emacs variables are divided into safe and unsafe
file variables: variables that are declared as safe – typ-
ically by Emacs maintainers – are evaluated automat-
ically. For unsafe variables, you must first tell Emacs
what to do: you can ignore the variable; or evaluate
it once, temporarily, for that file only; or declare it as
safe.
Program loader directives or
shebangs
are
also
sup-
ported. If your file begins with #! – for instance
#!/usr/bin/env python or #!/bin/bash – then Emacs
will figure out the major mode and run it, if it is avail-
able in Emacs. The variable interpreter-mode-alist
lists the program loaders Emacs can detect.
Magic mode detection uses the magic-mode-alist variable
to see if the beginning of the file matches a pattern
stored in the magic mode variable. This detection
mode applies if you have no way of annotating the
file or predicting the filename or extension ahead of
time.
Automatic mode detection is how most major modes are
applied.Emacshasaverylargeregistryofpatternsthat
match a file extension, file name or all or parts of a file’s
path, stored in the variable auto-mode-alist.
For instance, if you open /etc/passwd, Emacs will de-
tectthisandopenthefilewith etc-passwd-generic-mode
major mode. If the filename ends with .zip, Emacs
will instead open the file in archive-mode.
91

## [p.92]
The Theory of Movement
Although the different heuristics may look complicated, the
good news is the work is done for you. Emacs’s major mode
detection is rather sophisticated and it will almost always
pick the right thing for you.
Coding Systems and Line Endings
Emacs applies two other important heuristics you should
know about: coding systems and line endings.
Coding systems Emacs has excellent Unicode support
(type C-h h to see it demonstrated), including transpar-
ently reading and writing between different coding
systems, bidirectional right-to-left script support,
keyboard input method switching, and more.
To see the coding system in use for the current buffer,
you can type C-h C <RET>. Emacs will display a lot of
information, including all the coding systems associ-
ated with the buffer — but for files, they are almost
always set to the same coding system.
The modeline will also give you a rough idea:
U:**-
helloworld.c
92% of 5k
...
The first character, U, means the buffer helloworld.c
has a multi-byte coding system. If it said 1, it would
typically be part 1 of any number of ISO character en-
codings. The exact mnemonic will depend on which
of the hundreds of supported coding systems you are
using — hence why C-h C <RET> is a sure-fire way to
see what it is.
92

## [p.93]
The Theory of Movement
Line endings When you open a file, Emacs will determine
the line endings used. If the file uses DOS line endings,
then they are preserved when you open the file and
when you save it. Likewise for UNIX and pre-OSX Mac-
intosh encodings.
The modeline will tell you what line ending you are
using:
U:**-
helloworld.c
92% of 5k
...
The first character U, as explained above, indicates the
coding system. The : means it’s UNIX-style line endings.
For DOS it would say (DOS), and (Mac) for Macintoshes.
C-x C-s: Save Buffer
In The Buffer, I explained that in Emacs a buffer need not
be a file on your file system, but it could be a transient buffer
used for things like network I/O or even just a scratch file for
processing text. So, what that means in practice is that you
can save any buffer in Emacs — even internal ones like a help
or a network I/O buffer.
When you ask Emacs to save a buffer, it will save it to the file
associated with the buffer – if, and only if, the buffer has a
filename associated – or ask you for a name if there isn’t one.
The latter instance will typically happen if you’re saving a
buffer that does not yet have a file assigned to it; maybe it’s a
temporary buffer or even the output from a help command.
93

## [p.94]
The Theory of Movement
Writing a buffer to a file If you want to save a buffer to a
different file – akin to Save As… in other editors – you
can use the command C-x C-w to write to a new file.
Saving all files You can type C-x s and you are asked, in
turn, to save each unsaved file.
C-x C-c: Exit Emacs
You can exit Emacs – or just terminate your connection to
it, if you are using Emacs in client-server mode – but Emacs
will only exit after asking you if you want to save unsaved
files.
You have several options when Emacs asks you to save a file:
Key Binding
Purpose
Y or yes
Saves the file
N or DEL
Skips current buffer
q or RET
Aborts the save, continues with exit
C-g
Aborts save and the exit
!
Save all remaining buffers
d
Diff the file on the file system
with the one in the buffer
Most of the commands above are self-explanatory. Emacs
will traverse the entire list of unsaved files but not all unsaved
buffers. As you may recall from earlier, it is possible to have
buffers that are not attached to any one file.
And if you try to exit without saving, Emacs will always ask
you one last time if you want to proceed.
94

## [p.95]
The Theory of Movement
C-x b: Switch Buffer
If you edit more than one file at a time – or switch between
documentation buffers or mode-specific buffers, such as
Python’s shell – knowing how to switch buffers quickly
and efficiently is very important.
Like Alt+TAB in most window managers, Emacs will remem-
ber the last buffer you visited so that, when you type C-x b,
the name of the former buffer is the default action — meaning
pressing RET will take you to it.
Switching buffers is second nature to Emacs hackers. Once
you’re comfortable with it, you won’t even think about;
you’ll switch through buffers quickly and instantaneously
without so much as a second thought.
Buffer naming conventions
Some buffers in Emacs interact with external
programs – perhaps a shell like bash – or they
hold transient information generated by Emacs
itself. To distinguish them from user-created
buffers, they have * characters in their names,
like so: *buffername*.
The fact that files and buffers are two distinct (but related)
concepts makes sense when you consider the nature of scratch
buffers — buffers that you create and use but don’t intend
to permanently save. For instance, if you want to run a key-
board macro or do extensive text editing on a region of code,
an Emacs hacker would copy it to a made-up scratch buffer
(created simply by switching to a buffer name that does not
95

## [p.96]
The Theory of Movement
exist), do the requisite editing, and switch back to the origi-
nal buffer.
Writing buffers to files If you later decide you want to
save the buffer to the file system, you can press C-x
C-s to save it.
Listing buffers Another worthwhile command is C-x C-b.
It displays a list of all buffers running in Emacs. How-
ever, I would recommend you use its bigger brother,
M-x ibuffer. It is not bound to a key by default, so I
recommend you make it so by adding this to your init
file:
(global-set-key [remap list-buffers] 'ibuffer)
Buffer Switching Alternatives
The built-in interface for buffer switching is rather poor; it
offers basic TAB-completion and some fuzzy matching, but
little else. In fact, completion tooling is so important to your
user experience that I recommend you set aside time to inves-
tigate completion frameworks that fit your workflow and
personality. If you are using a starter kit you may already
have one preconfigured and enabled in your Emacs.
Nevertheless, for most people starting out, I recommend
IDO if you are using Emacsen earlier than version 27, and
FIDO (a drop-in replacement) for versions 27 or later.
Regardless of the version, I use both and couldn’t live with-
out them — indeed, most Emacs users will most certainly
have used IDO or something like it at some point.
96

## [p.97]
The Theory of Movement
For IDO Mode Type M-x ido-modeandthentry C-x bor C-x
C-f again.
You can enable it permanently by customizing the op-
tion ido-mode:
M-x customize-option ido-mode
You can also improve IDO’s fuzzy matching by
enabling flex matching:
M-x customize-option ido-enable-flex
-matching RET
And you can customize many more features by run-
ning M-x customize-group ido.Forfurtherreadingon
this subject, I recommend you read Introduction to IDO
mode.2
For FIDO Mode (Emacs 27 or later) Type
M-x fido-mode.
There are some completion options related to this
mode, but they are under the umbrella group
icomplete, the parent completion mechanism FIDO is
built on. To view them, type M-x customize-group
icomplete.
Additional Completion Frameworks
There are dozens of completion frameworks
available in the package manager today. Most
2 https://www.masteringemacs.org/article/
introduction-to-ido-mode
97

## [p.98]
The Theory of Movement
trade off one another, swapping one conve-
nience or benefit for another: be it speed;
simplicity; features and integration with major
modes or external sources; search and comple-
tion methodology; or how results are presented
to the user.
Some of the more common ones in addition to
FIDO and IDO include: Helm, ivy, Selectrum, Ver-
tico, Icicles, Icomplete.
What, and how, you complete or search for
information is a self-perpetuating debate in the
Emacs community, and a great way to explore
the different ways of combining and accessing
information and workflows. I recommend
you try most of these frameworks and see
what they’re capable of: they are true force
multipliers; especially the ones that merge
results from third-party sources (command line
tools, language servers, etc.)
C-x k: Kill Buffer
Killing a buffer in Emacs means closing it. You don’t have to
kill buffers you don’t use. It’s perfectly normal to let them sit
in the background until you need them again. Normally, se-
rious Emacs users have hundreds or even thousands of open
buffers at a time.
98

## [p.99]
The Theory of Movement
ESC ESC ESC: Keyboard Escape
The click your heels three times key. If you’re stuck somewhere
or want to “go back to normal” — then pressing ESC ESC
ESC will (probably) solve your problems.
All windows are deleted (meaning they’re hidden from
view); prompts are exited out of; special buffers are hidden;
prefix arguments are cancelled; and recursive editing levels
are unwound.
C-/: Undo
Undoing is a common activity and it is bound to several keys:
C-/, C-_, C-x u, Edit -> Undo, or even a physical undo button
if your keyboard has it.
Which command you prefer is up to you: I think C-/ is the
easiest to type, but if your character set is not US or UK,
then you may prefer another. Most beginner’s guides will
recommend you use C-x u or even C-_ but I find them harder
to type than C-/.
Repeating Keys in Emacs 28
Emacs
28
adds
the
concept
of
repeating
keys.
If
you
enable
repeat-mode
with
M-x customize-option RET repeat-mode RET
you can chain repeated undo statements with
C-x u ... u. Not all keys in Emacs work this
way, but you can see a list of the ones that do
with M-x describe-repeat-maps.
99

## [p.100]
The Theory of Movement
Unlike other editors, the undo system in Emacs can be a
source of confusion. Instead of storing changes you make in
a list that you can undo and redo from, in Emacs it’s stored
in what’s known as the undo ring.
Most editors feature a linear undo list: you can undo and
redo, but if you undo and then change the text, you will
lose the undone steps; they will be unrecoverable and lost
forever.
In Emacs, this is not the case. Every action you take is
recorded in the undo ring, and this includes the act of
undoing something. Emacs will group certain commands
together into one cohesive undo cell — like typing charac-
ters or repeating the same command many times in a row.
Some events will always “seal” the undo record and start
a new one. Pressing RET, backspace, or moving the point
around are three such examples.
Repeated undo commands will undo more and more things
but if you break the cycle – for instance by moving around
or editing text – Emacs will not resume from where you left
off. Instead, the items youjust undid were added to the undo
ring as redo records. That means when you undo again, you
will actually undo (redo) the actions you just did until you
get to the state you were at when you last stopped — then
Emacs will undo the rest of the changes in your buffer.
This means it’s next to impossible to lose undo history as the
act of undoing is itself an undo-able action. That means you can
undo a few things – like rewriting a paragraph in a buffer
– only to realize later on that, actually, you liked the old
text better. In other editors your undone changes would be
gone forever as they have linear undo lists. In Emacs you
100

## [p.101]
The Theory of Movement
undo your newly-written paragraphs until Emacs returns
your buffer to the state it was in before you did your last
undo.
It can be a little bit confusing. But with a little bit of practice
you’ll soon pick it up. As it’s impossible to really lose any
data with the undo ring, it’s easier to just experiment. Do re-
member that Emacs will keep undoing things from the ring
as long as you keep undoing commands one after another.
Only by breaking this “undo cycle” will you be able to redo
the undone changes. And the easiest way to break the cycle
is by simply moving your point, or writing something.
Here’s a simple example. It’s not how Emacs’s undo ring ac-
tually retains undo information – it’s rather more complex
than that – but I think that level of detail is unnecessary.
1. You sit down and write out the following, with █rep-
resenting the position of the point:
Hello
Emacs█
2. Now you undo once with C-/:
Hello
█
The first thing to note is the newline is preserved; gen-
erally, newlines will cause a ‘break’ and create a new
undo cell in the undo ring. Why it does that is sim-
ple pragmatism: often, if you want to undo something,
101

## [p.102]
The Theory of Movement
you do not want to undo many lines of prose or code,
but only the most recent text. Contrast that with edit-
ing in other programs where you’d often undo large
swathes of text, whether you want to or not.
3. Call undo again and you undo just the newline:
Hello█
4. Press enter again and type World:
Hello
World█
At this point we’ve written something; undone parts
of it; and now written new text.
5. Typing C-/ twice reverts from World back to Emacs.
6. Navigating to the first line and altering Hello to GNU:
GNU█
Emacs
7. Now repeatedly type
C-/ and you’ll undo your
previous writings and reveal the ones that were
subsequently overwritten during a previous undo cycle.
Repeat it enough times and you’ll eventually end up
with a blank buffer.
Emacs, in other words, does not lose information when
you undo.
102

## [p.103]
The Theory of Movement
If at any point you stop the undo process part-way
through – perhaps you’ve undone enough to bring
your buffer text to its desired state – you can break
the chain by issuing any command that is not another
undo command. Like movement.
Breaking the chain leaves the undo ring in the position
it was in when you broke the chain. Subsequent undo
commands now undo from that point, but in the other
direction: by redoing the previous undo steps.
Still confused? That’s normal. It’s a difficult concept to
“get” (and much harder to explain) but most Emacs
beginners will pick it up over time. The main point
to take away is that it’s almost impossible to break the
undo ring and lose information — so go ahead and
experiment. Chances are, to begin with, you only
care about undoing the most recent changes anyway.
Simulating the classic undo-redo behavior
In Emacs 28 there is a new command,
M-x undo-redo,
bound
to
C-?
and
C-M-_.
You can invoke it after you’ve used the regular
undo command one or more times in a row. It’s
a redo command for undo. However, when you
invoke it, it won’t push the “redo” step to the
undo ring.
Combineitwiththeobscure M-x undo-onlycom-
mand – which will not redo a previous undo – and
you have a facsimile of the undo-redo dynamic
you may know from other editors.
103

## [p.104]
The Theory of Movement
I recommend you instead spend the time to
familiarize yourself with the default undo
command as you’ll have to deal with the
concept of rings in many other parts of Emacs.
Although these two specialized commands may
find a place in your workflow, they do little to
simplify an already hard-to-grok concept.
By the way
You can download alternative undo implementa-
tions for Emacs. A popular one is Undo Tree.3
Window Management
Managing windows is another core skill you have to mas-
ter. Honestly, despite the chapter introduction saying it was
rather complex, the truth of the matter is it isn’t: there are
only a few key bindings you need to learn. What makes it
complex – or to some people, downright infuriating – is the
reliance on windows in the first place, and how to get used
to the windowing concept.
Let’s take a look at the key bindings you need to know about.
Key Binding
Purpose
C-x 0
Deletes the active window
C-x 1
Deletes other windows
C-x 2
Split window below
C-x 3
Split window right
3 https://www.emacswiki.org/emacs/UndoTree
104

## [p.105]
The Theory of Movement
Key Binding
Purpose
C-x o
Switch active window
These five keys are all you need to use, split and delete win-
dows. There are more commands, as you’ll see below, but
to start with, you can get by with these five commands.
Undoing window changes
Sometimes you want to return to a past window
configuration. The mode, M-x winner-mode, re-
members your window settings and lets you
undo and redo with C-c <left> and C-c <right>,
respectively.
To enable Winner mode permanently:
M-x customize-option RET winner-mode RET
Emacs will tile windows and generally ensure each new win-
dow is given roughly half the screen estate of the splitting
window. If you have just one window and you split to the
right, you now have two windows, each with a 50% share.
Deleting windows If you use C-x 0, then Emacs will delete
the active window – which is always the one where
the point is active – and if you type C-x 1, Emacs will
delete all other windows.
Splitting windows A window is split either horizontally
or vertically (or “below” and “right”) with C-x 2 and
105

## [p.106]
The Theory of Movement
C-x 3, respectively. If you have a large monitor, you
may want to split vertically so you can have more than
one buffer visible at a time; you may even prefer addi-
tional subdivisions. I always split into two or even four
windows, arranged in a 2x2 grid.
Finally, to move between windows use the command C-x o.
I rebind it to M-o as it’s such a common thing to do. You
should do the same by adding this to your init file:
(global-set-key (kbd "M-o") 'other-window)
Directional window selection
Some people prefer the windmove package that
ships with Emacs, as it lets you move in cardi-
nal directions instead of cycling through all win-
dows.
You can enable it by adding this to your init file:
(windmove-default-keybindings)
You can now switch windows with your shift
key by pressing S-<left>, S-<right>, S-<up>,
S-<down>.
Working with Other Windows
Once you’re comfortable splitting and deleting windows,
you can build on that by acting on other windows. That
is, if you want to switch another window’s buffer, you
106

## [p.107]
The Theory of Movement
have to C-x o to the window, then use C-x b to change the
buffer. It’s a bit tedious and it breaks your tempo. The other
window in this case is the one immediately after the current
one when you run C-x o.
Key Binding
Purpose
C-x 4 C-f
Finds a file in the other window
C-x 4 d
Opens M-x dired in the other window
C-x 4 C-o
Displays a buffer in the other window
C-x 4 b
Switches the buffer in the other window
and makes it the active window
C-x 4 0
Kills the buffer and window
C-x 4 p
Run project command in the other window
These commands are the most applicable ones for operating
on other windows. There are a few more – you can use C-x 4
C-h to list them – but you won’t use them as often.
If you look closely at the key bindings in the table above,
you will see a symmetry between C-x 4 and C-x — indeed,
they are almost identical in binding and purpose. This is no
coincidence, and the symmetry will help you remember the
commands.
Frame Management
You can create frames – what are called windows in other pro-
grams and window managers – and you may prefer to do
this if you use a tiling window manager or to take advan-
107

## [p.108]
The Theory of Movement
tage of multi-monitor setups. Note that frames also work
in terminal Emacs.
The prefix key used for frames is C-x 5. Like the prefix key
for windows (C-x 4) the commands are mostly the same.
Key Binding
Purpose
C-x 5 2
Create a new frame
C-x 5 b
Switch buffer in other frame
C-x 5 0
Delete active frame
C-x 5 1
Delete other frames
C-x 5 C-f
Finds a file in the other frame
C-x 5 p
Run project command in the other frame
C-x 5 d
Opens M-x dired in the other frame
C-x 5 C-o
Displays a buffer in the other frame
Switching buffers with multiple frames is seamless, if a
buffer is visible (it is displayed in a frame in a window)
Emacs will switch to the right frame where the buffer is
already visible.
Whether you choose to use frames or not is up to you. The
mechanics of dealing with multiple frames is slightly awk-
ward in Emacs as all frames share the same Emacs session —
which is sometimes a blessing or a curse. I find that frames
only come into their own with multi-monitor setups, but
not so much elsewhere. The usefulness of frames, I find, is
limited by the already excellent tiling window management
system present in Emacs. My only recommendation is to try
it out and see if frames fit your workflow.
108

## [p.109]
The Theory of Movement
Tab Bars and Tab Lines
One common complaint about Emacs was its lack of a native
“tab bar” – like the ones in web browsers and most other ed-
itors – but in Emacs 27 they added not one but two distinct
implementations that solve two common problems. It’s a
long time coming, but the implementation and user expe-
rience is sound and, in true Emacs fashion, utterly customiz-
able to third-party package authors and users alike.
If you’re not using Emacs 27, you can find third-party imple-
mentations in the package manager: they are facsimiles of
the real thing, relying on a quirk in the Emacs rendering en-
gine to provide a semblance of the real feature. But, if you
are the sort of person who prefers the mental model of see-
ing a row of tabs, then you will likely find either implemen-
tation useful.
Custom Themes
If you’re using a custom theme that predates
Emacs 27, you may find the color scheme does
not extend to the new faces that govern the
tab bar and tab line modes. You can customize
them by typing M-x customize-apropos-faces
tab-.
There are two new tab modes, and they each solve different
problems.
109

## [p.110]
The Theory of Movement
Tab Bar Mode
A tab is a window configuration. In Emacs, a window configu-
ration is a collection of windows – size, location, the buffer,
and so on – that captures the layout of your Emacs frame.
You can save them to disk; to a register, but more on them
much later; or indeed to a tab bar.
In an IDE this would be referred to as workspaces or projects,
perhaps. If you often find yourself switching between entire
workflows – maybe an OrG mode agenda and planner along
with your email for one thing, and another for your coding
– then you’d have two distinct window configurations. The
Tab Bar mode makes it easy to organize your thoughts into
persistent window configurations.
One common complaint about Emacs – from new or expe-
rienced users alike – is the complexity in managing the win-
dows as the system of splitting and where buffers appear is
opaque and hard to understand.
Tab Bar Mode takes aim at that complexity with an intuitive
interface very similar to the frame, buffer and window man-
agement commands I demonstrated earlier.
To enable tab bar mode you can customize M-x customize-
option RET tab-bar-mode;
type
M-x tab-bar-mode;
or
simply invoke one of the key bindings below.
The prefix key for tab bar mode is C-x t.
Key Binding
Purpose
C-x t 2
Create a new tab
C-x t 0
Close the current tab
110

## [p.111]
The Theory of Movement
Key Binding
Purpose
C-x t RET
Select tab by name
C-x t o, C-<tab>
Next Tab
C-S-<tab>
Previous Tab
C-x t r
Rename Tab
C-x t m
Move tab one position to the right
C-x t p ...
Run project command in other tab
C-x t t
Execute command in other tab
C-x t 1
Close all other tabs
C-x t C-f, C-x t f
Find file in other tab
C-x t b
Switch to buffer in other tab
C-x t d
Open Dired in other tab
Like the frame, window, and buffer management key bind-
ings, the tab bar bindings follow the same pattern: actions
that affect other tabs is akin to creating a new tab.
New tabs are named according to the buffer that triggered
their creation, and the active buffer thereafter. You can re-
name and move them around the tab bar as you see fit. If
you prefer,youcanuse C-x t RET toselect tabsbytheirname.
Likewise, you can switch to the next or previous tabs with
C-<tab>, C-S-<tab>, or the mouse.
If you dislike seeing the tab bar itself, you can hide it with
M-x customize-option tab-bar-show, and still benefit from
all the capabilities of the tab bar.
There are a handful of commands not bound to any key.
111

## [p.112]
The Theory of Movement
Command
Purpose
M-x tab-list
Shows an interactive tab list
M-x tab-undo
Undoes a closed tab for each invocation
M-x tab-recent
Switch to the last visited tab
I think tab bar mode shines if you prefer manicured win-
dow configurations and a simple set of tooling to manage
them. By including common utility functions like finding
a file; switching a buffer; opening dired, etc. they let you
jump from an existing tab bar configuration to a new one
quickly. Combine it with the ability to quickly close, re-
name or jump back and you can consider tabs like you would,
say, frames: a logical collection of windows and their state,
but without the hassle of managing multiple frames.
However, it’s not uncommon still for a window configura-
tion to get out of order: earlier in Window Management
I talked about winner-mode, a way of undoing and redoing
recent window configurations. It’s not nearly as worth-
while with tab bars as it does not understand tab-specific
window configurations. Instead, I recommend you enable
M-x tab-bar-history-mode
with
M-x customize-option
tab-bar-history-mode.
Tab bar history mode manages a tab-specific history of win-
dow configurations. Unfortunately the commands to step
through the history is not bound to anything. The snippet
below borrows the key bindings M-x winner-mode uses by de-
fault. If you want to use both, you should choose your own
key bindings4 .
4 Mastering Keybindings in Emacs is a detailed article on this subject.
112

## [p.113]
The Theory of Movement
Add this to your init file:
(global-set-key (kbd "M-[") 'tab-bar-history-back)
(global-set-key (kbd "M-]") 'tab-bar-history-forward)
Now when a tab’s window configuration (or a buffer in one
of the windows) changes you can walk forward or backward
through that history.
For most workflows, window and tab bar management is
all you need to tame Emacs’s window management for your
day-to-day needs.
Tab Line Mode
Unlike tab bar mode, the tab line mode is feature more
akin to the tabs you’ll find in a web browser. Like the tab
bar mode, its primary purpose is to group related things
together: by default the tab line will, when enabled, list
buffers previously opened in that window.
Toenableit,type M-x customize-option global-tab-line-mode;
or M-x global-tab-line-mode.
There are only two key bindings worth learning.
Key Binding
Purpose
C-x <left>
Select previous buffer
C-x <right>
Select next buffer
Using the key bindings you can cycle through the list of
113

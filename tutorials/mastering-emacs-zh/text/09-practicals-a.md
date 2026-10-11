# 实用篇（一）：探索、项目管理、Xref、日志

> 原书来源：Mastering Emacs (Eli Spare)，第 271–289 页。
> 覆盖范围：Exploring Emacs, Project Management, Xref, Working with Log Files

## [p.271]
Chapter 6
The Practicals of Emacs
“[…] Emacs outshines all other editing soft-
ware in approximately the same way that the
noonday sun does the stars. It is not just bigger
and brighter; it simply makes everything else
vanish.”
– Neal Stephenson, In the Beginning… was the
Command Line.
In earlier chapters, I have almost exclusively talked about
the theoretical aspects of Emacs. Galvanizing your brain
and finding practical or novel applications is something else
though; for most, theory is not enough. In this final chapter,
I will show you what I call workflow — walkthroughs that
cover a specific area or problem in some depth.
Unlike the last two chapters, I won’t cover the commands
and features I introduce in this chapter in any great detail. I
leave that to you to discover on your own time. If you are
271

## [p.272]
The Practicals of Emacs
still unsure how to do discover new features, then read on —
the first part of this chapter is Exploring Emacs.
Exploring Emacs
To truly master Emacs, you have to learn how to find things.
It is alpha and omega in Emacs. Manuals, books and blog
posts make assumptions about your editing environment —
about Emacs. Once you change variables, rebind keys or al-
ter Emacs to suit your own needs, you create a unique combi-
nation of changes that few other people, if any, have. There-
fore, to diagnose issues, or fix and change things you dislike,
you have to know how to find those things in the first place.
Let’s explore VC, Emacs’s Version Control interface. The VC
system is a powerful and underutilized facility in Emacs that
exposes a generic interface – for things like version history,
blaming, committing, pushing and pulling – that then talks
to your chosen version control system. VC is great if you reg-
ularly work with more than one versioning system.
If you weren’t aware of VC before and your first introduction
to it is reading about it now, how would you learn about it?
Reading the Manual
Unsurprisingly, Emacs’s manual is well-written and exten-
sive. Let’s begin by opening Emacs’s manual about Version
Control.
1. Open the M-x info manual by typing C-h i.
272

## [p.273]
The Practicals of Emacs
2. Navigate to the Emacs hyperlink and open it.
3. Search with C-s for version or version control.
Lo and behold, if you tap C-s enough times eventually
you’ll come across the Version Control manual that
way.
So, reading the manual works well — but not every feature
has a manual. And perhaps the chapters are buried in a sub-
sub-sub-chapter out of easy reach. And third-party packages
almost never ship with info manuals.
Apropos for info manuals You can use the command
M-x info-apropos with a search pattern and Emacs
will crawl all known info manual pages looking
for matching patterns. If you are unsure of where
something is, this command is a powerful tool.
Using Apropos
In Apropos, I listed all the many ways of querying Emacs’s
documentation system using apropos. One of those apropos
commands will search the doc string – the documentation
string accompanying most variables and functions in Emacs
– and list the matching function or variable. Searching
Emacs’s documentation strings is the most scattered ap-
proach to finding things: you are literally searching plain
text documentation. To do this, use C-h d, which is the
apropos command that searches documentation.
Namespacing in Emacs Lisp
273

## [p.274]
The Practicals of Emacs
Emacs Lisp, unlike other lisps, lacks namespac-
ing. There is no separation of concerns using
modules or namespaces in Emacs. In practice,
it’s not a huge deal (there are bigger fish to fry)
but it does mean that, informally, packages in
Emacs prefix their symbols (functions, variables,
etc.) so they don’t clash.
Examples include python- for the Python major
mode; apropos- for apropos-related commands,
and so on.
Nevertheless, if you search for version control with C-h d,
the first result is this:
vc-mode
Function: Version Control minor mode. This
minor mode is automatically activated whenever
you visit a file under control of one of the
revision control systems in
`vc-handled-backends'.
VC commands are globally reachable under the
prefix `C-x v':
We now have a lead. The VC mode is vc-mode. However, we
want the prefix it uses and it is vc-.
Knowing that VC’s prefix is vc-, we can use M-x apropos
-command, bound to C-h a, to find all the VC commands:
274

## [p.275]
The Practicals of Emacs
M-x apropos-command
Then at the prompt, enter:
Search for a command (word list or regexp): ^vc-
Emacs returns the results of the Apropos search:
vc-annotate
C-x v g
Display the edit history of the current
FILE using colors.
vc-check-headers
M-x ... RET
Check if the current file has any headers in it.
vc-clear-context
M-x ... RET
Clear all cached file properties.
[...]
You’ll see a list of commands along with a brief description
and the key binding, if any.
A quick browse through reveals a handful of interesting com-
mands.
Keys and Commands
Description
C-x v
Prefix key for vc-
M-x vc-dir, C-x v d
Shows VC status
M-x vc-diff, C-x v =
Diff buffer and last revision
M-x vc-annotate, C-x v g
Show blame
M-x vc-next-action, C-x v v
Does next logical action
M-x vc-print-log, C-x v l
Prints commit log
275

## [p.276]
The Practicals of Emacs
With these, it’s easy to see a trend. A lot of the commands
are bound to the prefix key C-x v. The next step would be
to see what commands are bound to the prefix key itself by
appending C-h.
C-h: Exploring Prefix keys
In Discovering and Remembering Keys, I showed you that
appending C-h when you enter a partial (prefix) key lists all
the keys bound to that prefix key. C-x v is no exception: typ-
ing C-x v C-h lists all the keys bound to this prefix key.
Typing C-x v C-h yields this:
Global Bindings Starting With C-x v:
key
binding
C-x v +
vc-update
C-x v =
vc-diff
C-x v D
vc-root-diff
C-x v G
vc-ignore
C-x v I
vc-log-incoming
C-x v L
vc-print-root-log
C-x v O
vc-log-outgoing
C-x v a
vc-update-change-log
C-x v b
vc-switch-backend
[...]
The great thing about this command is that it is so easy to
type. If you forget that C-x v = diffs the current file with
the last file revision? No problem – C-x v C-h shows that
bound to C-x v = is M-x vc-diff. The other obvious benefit
276

## [p.277]
The Practicals of Emacs
is it exposes you to commands you wouldn’t otherwise con-
template using, or even knew existed. Perhaps you have a
new need to, say, create a tag (C-x v s) and if you’re unsure
of what it’s called or what it is bound to – or indeed if such a
feature even exists in Emacs – then C-h may shed some light
on it.
C-h k: Describe what a key does
On the other end of the spectrum is having a key and not
knowing what it does. The command C-h k takes a key bind-
ing and shows you what is bound to that command in the
active buffer. For instance, C-h k followed by C-x v v shows
you not only the name of the command but the doc string for
that command. Usually, the text is descriptive and explains
what the command does:
C-x v v runs the command vc-next-action (found
in global-map), which is an interactive
autoloaded compiled Lisp function in `vc.el'.
It is bound to C-x v v, <menu-bar> <tools> <vc>
<vc-next-action>.
(vc-next-action VERBOSE)
Do the next logical version control operation on
the current fileset. This requires that all
files in the current VC fileset be in the same
state. If not, signal an error.
277

## [p.278]
The Practicals of Emacs
...
Shown above is the key binding and the command it runs.
It also shows you where the command was found – in this
case in the global map, because it is a global key – and the
library file containing the command. Next, all the keys (it
may have multiple bindings) it occupies are listed, followed
by the function arguments if you were to call the command
directly from lisp. And then, finally, is the documentation
string describing the command.
All this information is dynamically generated when you call
C-h k.
The slight downside of
C-h k is that its intended audi-
ence are elisp hackers and not end users; the doc string
describes how the command works from a technical
perspective and that usually means explaining how each
argument, and other technical minutia of little relevance
to end users, works. But that’s usually not a problem for
a technically-minded person, even if you are not a lisp
developer.
Describing commands If you have the name of a com-
mand, such as vc-dir, you can use C-h f and Emacs
will describe what the command does.
C-h m: Finding mode commands
If you run the command C-x v d, a new buffer appears show-
ingyou the versionstatus ofyourcurrentbuffer’srepository;
things like untracked and modified files are shown here. But
278

## [p.279]
The Practicals of Emacs
how do you interact with it? How do you discover how to
use VC’s status buffer?
The answer is C-h m, a help command that describes the doc-
umentation strings present in the active major mode and mi-
nor modes. In other words, use this command to figure out
what each major and minor mode does (and what keys, if
any, they expose).
So, calling C-h m inside a VC status buffer yields a plethora of
keys and documentation:
key
binding
C-c
Prefix Command
TAB
vc-dir-next-directory
C-k
vc-dir-kill-line
RET
vc-dir-find-file
...
From then on it’s a simple matter of clicking (with RET or the
mouse) on each hyperlink you are interested in.
M-S-x: Execute Extended Command for Buffer
Another option is to use M-S-x, introduced in Emacs 28. It
won’t yield great results everywhere, though: it relies on
both keys bound to the active modes in the current buffer,
and that mode authors augment their code with hints to
M-S-x to show important commands.
279

## [p.280]
The Practicals of Emacs
For VC, it works best in dedicated modes like C-x v d, and
can serve as a supplement to C-h m.
Project Management
Historically, Emacs always looked at files in isolation and
never as a collection of related files. Despite the presence of
filesets – a part of Emacs since 2002, and yet so obscure
even the maintainers forgot about it – Emacs mostly left that
role to directory-local variables1 and external tools like Make-
file and friends. That made it hard for the Emacs maintainers
and the community to build a consistent narrative to work-
ing with multiple files, such as searching & replacing, compil-
ing, and so on. That changed in Emacs 23 with EDE, a subset
of CEDET, itself a very complex suite of tools to give Emacs
IDE-like functionality.
What is CEDET?
CEDET is a collection of tools that offer language
parsing with semantic analysis and code comple-
tion; project management; code generation; di-
agramming; and more. It works well with C &
C++ and had a large following in that commu-
nity, but never really caught on elsewhere. An
abridged version was included in Emacs 23.
1 Emacs would read and evaluate a (configurable) subset of elisp if it
found a .dir-locals.el file. It’s a powerful concept, but a poor substi-
tute for project management.
280

## [p.281]
The Practicals of Emacs
Like CEDET, EDE never really caught on, and in the meantime
a large number of third-party libraries (like Projectile) flour-
ished as multi-language projects became more common.
They also changed the notion of what project management
should be by basing it around the existence of a source
control repository instead of a static project file that you
selectively add or remove files from.
Since then, Emacs introduced project.el, and it’s been ac-
tively worked on since then. The “new” project manager
is feature-rich, and it’s taken inspiration from the collective
work of third-party tools to build something that, I think, is
a great out-of-the-box experience for most users.
Some of the feature highlights include:
Inferring files from VC-indexed files Emacs will automat-
ically guess the files relevant to the project with the
assumption that if the file is indexed by the version
control system you are using, then it is probably rele-
vant to the project user.
Root directory inferred from the VC home directory
Important, as file searches, linting tools, compile
commands, and so on are often executed relative to a
root directory.
Built-in support for enumerating project files For
searching and replacing across multiple files in the
project, or subsets of the project files.
Selection of commands that work with projects Such as
opening a M-x shell or M-x dired buffer; finding a file;
281

## [p.282]
The Practicals of Emacs
killing project-related buffers; or switching to another
project by name.
Though the details I listed here may seem low-level, they
are important: this is a sorely-missed feature in Emacs, and
laying a good foundation – which they have done – is impor-
tant as uptake in the wider community is essential now that
it is here.
If you don’t have strong preferences already on what to use,
you should use this. To do so, all you need is a Git or Mercu-
rial repository.
There’s a prefix keymap reserved just for projects bound to
C-x p (introduced in Emacs 28):
Project Keys
Description
C-x p p
Switch to other known projects
C-x p b
Switch to buffer
C-x p f
Find file2 in project
C-x p k
Kill project buffers
C-x p g
Search by regexp
C-x p r
Query regexp search and replace
C-x p c
Compile project
C-x p v
Open VC Dialog
C-x p s
Open a Shell
C-x p d
Open a Dired buffer
Unlike their more general counterparts, key bindings like
C-x p f and C-x p b work the same way but are of course
2 IDO will not complete here by default if you use it. But FIDO will.
282

## [p.283]
The Practicals of Emacs
restricted to files known to your project. The same goes for
all the commands: they will act within the confines of the
project as defined by its backend — which, by default, is the
VC root directory and any files known to it.
Xref: Cross-References in Emacs
Xref is a unified platform to match symbols (like the one un-
der point) to their definitions, and then present them to the
user so they can edit or jump to them. It does this with con-
figurable backends that may change depending on the major
mode of the buffer you execute it in. It’s designed to work
with third-party packages, though it’s not widely adopted
yet, and tools that generate their own lists of symbol defini-
tions.
The four most common commands you should know about
are:
Keys
Description
M-.
Find definitions at point
M-,
Pop marker3 and return
M-?
Find references matching a pattern
C-M-.
Find symbols matching a pattern
If you invoke xref’s find a definition with M-., you’re more
likely asked to find a TAGS table file first if your major mode
does not have xref configured already. TAGS files are an old-
3 When commands like M-. whisk you away from where you were,
they leave behind markers that you can return to later.
283

## [p.284]
The Practicals of Emacs
school way of generating identifiers and their locations and
then storing them in large, static lookup tables on your file
system to improve performance. TAGS files work well if
you work on astronomically large projects. But for most of
us, tools that search your file system on the fly (or query a
Language Server) is usually all you need.
To get you started, I recommend you try the third-party
package
dumb-jump which, despite its name, leverages
the speed of file searchers like grep, ack, ag or ripgrep
to find matches relevant to your major mode. For most
things it’s more than good enough. ripgrep in particular is
unfathomably fast on modern hardware and pairs well with
Emacs4 .
Once configured, you can jump to an identifier with M-. and
to return you can pop markers off the stack with M-,. If there
are multiple definitions, or if Emacs is not sure which one
is the best one, you’ll be shown a buffer of definitions that
match. You can also match against a regexp with C-M-..
Popping the Stack
A common set of terms in Emacs is to pop
something off the stack, referring to the Computer
Science concept of removing the most recently
added item to a list. You’ll see it here and there
in Emacs’s user-facing commands, like this one.
The M-? key binding may fall back to searching your project
directory with common file searching tools like grep if there
4 Have a look in the package manager; type M-s o ripgrep in the
package list to find packages mentioning it.
284

## [p.285]
The Practicals of Emacs
is no other backend available. Usually, that is an OK starting
point.
The results are shown in an xref definitions buffer.
Xref Buffer Keys
Description
RET
Jump to definition
TAB
Jump to definition, and hide xref
C-o
Show definition
. and ,
Navigate to next or prev line
r
Query search and replace regexp
Try using . and , to quickly browse through lists of
matches to find the definition you need. Emacs will jump
to the matches as you move through the list. Once you’re
happy with the selection you can press TAB to jump to the
definition at point and close the xref buffer.
Type r and you’re prompted for a regexp to search and re-
place with. It works the same as C-M-% that I talked about in
Search and Replace.
Xref and Dired
Xref is also available in Dired: you can type A to
search and Q to search & replace in marked files.
Working with Log Files
Poring over log files is a common activity and there are tools
in Emacs that makes it a snap to stay on top of them.
285

## [p.286]
The Practicals of Emacs
Keys
Description
C-x C-f
Finds a file
C-x C-r
Finds a file in read only mode
C-x C-q
Toggles read only mode
Opening the log file is the first step. You may want to open
it read only; if the file is not writable, Emacs will open it
in M-x read-only-mode automatically. You can toggle it on
and off with C-x C-q. The reason you may want to disable
read only mode is so you can apply destructive changes to
the buffer, such as flushing or keeping lines:
Keys
Description
M-x flush-lines
Flushes lines matching a pattern
M-x keep-lines
Keeps only lines matching a pattern
M-s o
List lines matching a pattern
M-s o creates an Occur mode buffer matching a pattern. What
a lot of people never consider is that you can re-run M-s o
on an Occur mode buffer to filter it further.
It’s easy to suffer pattern blindness and miss things if you
scroll through row after row of nearly-identical log entries.
Emacs’s highlighters work well here, as they highlight
patterns in your buffer in different colors so you can tell
them apart:
286

## [p.287]
The Practicals of Emacs
Keys
Description
M-s h p
Highlights a phrase
M-s h r
Highlights a regular expression
M-s h .
Highlights symbol at the point
M-s h u
Removes highlighting under the point
Highlighters work well, and they work everywhere in Emacs.
Even if you don’t commit the keys to memory, just know
that they are all named highlight- and are thus easy to exe-
cute, when you need them, with M-x.
Log files are rarely static files: they are constantly changing
or appended to. You can enable a minor mode so Emacs re-
freshes a file if it changes on your file system. On newer ver-
sions of Emacs, it’ll use file change events (on most modern
platforms) and polling on older systems that don’t support
notifications.
Keys
Description
M-x auto-revert-mode
Reverts buffer when
file changes
M-x auto-revert-tail-mode
Appends changes when
file changes
Both modes are similar.
M-x auto-revert-mode is es-
sential if the file content changes frequently. Emacs
detects
changes
and
simply
reloads
the
entire
file.
M-x auto-revert-tail-mode, on the other hand, works
the same way as tail -f: when the file changes, the changes
are appended to the end of the buffer and Emacs will scroll
287

## [p.288]
The Practicals of Emacs
accordingly.
Browsing Other Files
There is, of course, nothing stopping you from applying
these concepts to other file types. For instance, Emacs ships
with auto compression mode – a passive mode enabled by de-
fault – that automatically de-compresses and re-compresses
files when you open and save them. Combine it with
M-x dired and you can browse compressed archives as
though they were directories.
Dired: Thumbnail Image Browser
You can type M-x image-dired and enter Emacs’s image
thumbnail browser. You’ll see a window with thumbnails
and a dired window with the files.
The thumbnail buffer comes with a large array of key bind-
ings. Here are some of them:
Thumbnail Keys
Description
C-f, C-b
Move to the next or previous thumbnail
C-n, C-p
Move up or down a row of thumbnails
d, m, u
Delete, mark, or unmark (like Dired)
t t, t u
Tag or untag image
RET
Open image
l, r
Rotate thumbnail left or right
The full-sized image buffer offers three key bindings:
288

## [p.289]
The Practicals of Emacs
Image Keys
Description
q
Quit
s
Resize image to window
f
Show in full size
Note, though, that opening the file from dired puts you in
Image Mode, a general-purpose image viewer (and far more
powerful), and not Dired Image Display Mode.
DocView: Viewing Rich Documents
If your system is relatively modern, and if you have the right
programs installed5 , you can take advantage of Emacs’s abil-
ity to render images and have it convert PDF and Open / MS
Office documents on-the-fly when you open them.
DocView Support
For a full list of what Emacs will attempt to
convert, you can type C-h v auto-mode-alist
and search for doc-view. You may remember
that variable from early on in the book where
we talked about Major mode load order.
To use DocView, open a PDF or other supported binary file
and Emacs will attempt to render it for you. When open,
some of the key bindings available to you are:
5 Which ones you need is platform specific, but M-x customize-group
doc-viewwillshowyouwhatyouneed.FormostLinuxdistros,itshould
work out of the box.
289

# 移动理论（三）：搜索与索引

> 原书来源：Mastering Emacs (Eli Spare)，第 154–189 页。
> 覆盖范围：Searching and Indexing (Isearch, Occur, Imenu, Helm, IDO, Grep)

## [p.154]
The Theory of Movement
the mouse to click-drag selections, or use the arrow key se-
lection with S+<arrow key>, which behaves much as it does
in other applications.
Searching and Indexing
Elemental movement commands act mostly on syntactic
units. Their primary purpose is to serve as successively
more precise tools for getting you from A to B — from
navigating by entire paragraphs or defuns down to moving
by a single character.
Often, however, you want to search for text in a buffer. Nat-
urally, this is something Emacs does well. What is perhaps
unique to Emacs is the idea that text search should be as fast
and streamlined as everything else. As you’ll soon see, that
means Emacs’s search facilities work equally well for navigat-
ing.
Isearch: Incremental Search
Emacs’s incremental search – or just Isearch – is a supremely
powerful search function bound to C-s and one you will use
a lot in your Emacs career. Beneath its simple exterior is a
sophisticated set of auxiliary commands:
Key Binding
Purpose
C-s
Begins an incremental search
C-r
Begins a backward incremental search
C-M-s
Begins a regexp incremental search
C-M-r
Begins a regexp backward incremental
154

## [p.155]
The Theory of Movement
Key Binding
Purpose
search
RET
Pick the selected match
C-g
Exit Isearch
M-<, M->
Jump to first or last match (Emacs 28)
C-v, M-v
Jump to the next or previous match
not currently visible (Emacs 28)
Using Isearch is easy:
Pick a direction of search You can begin a forward or
backward Isearch with C-s or C-r, as per the table
above. The minibuffer will show
I-search: or
I-search backward:.
If you previously searched for something, you can re-
call the last search term by repeating the Isearch com-
mand. So, if you want to recall the last search term,
you can type C-s C-s to first open Isearch and then re-
call the last search string. Emacs will automatically start
a new incremental search when you do.
Begin typing Every key you press will trigger the incre-
mental search engine to find the first match in the
direction of your search that matches your search string.
When it encounters the first match, the incremental
search engine will highlight all other matches of that
search string in your buffer; if there are no matches
to your search string, Emacs will stop when it has
matched as much as it can and tell you it has failed.
155

## [p.156]
The Theory of Movement
Browse the matches If you have more than one match, or
if you simply want to walk through all the matches,
keep tapping the direction key (C-s or C-r) in which
you want to search. If you want to reverse the direction,
simply tap the other direction and Emacs will switch
directions.
If you reach the end of the matches – or if there are no
matches in your search direction – you can continue
the search from the beginning or end of the buffer (de-
pending on the directionality of your search) by tap-
ping the direction key again. The minibuffer will tell
you if it wrapped the search around to the other side.
Isearch will also tell you what part of your search
string failed to match and what parts didn’t, by
highlighting the failed match in red.9
In Emacs 28 you can tell Emacs to jump to the first or
last match in the buffer, with M-< and M->; or the next
or previous match not currently visible with C-v and M-v.
The key bindings are not enabled by default, though.
You must customize isearch-allow-motion to enable
them.
Jumping to the first or last match in a buffer is com-
mon enough that most people can find some utility in
them. But I feel the ability to jump between matches
not visible in your buffer deserves a special mention:
it’s a great way to quickly move through a buffer with
a large number of matches. Every invocation jumps
to the first non-visible Isearch match in the direction,
9 Although this will depend entirely on your custom color theme.
156

## [p.157]
The Theory of Movement
so you get one window’s worth of matches at a time.
Worth knowing about if you’re scanning the buffer for
matches and you’re looking for something around the
matches.
Pick a match Once you are happy with a match, you can
terminate the search in two ways:
C-g exits Isearch Your isearch session is terminated,
and you’re returned to your original position.
If you have a search string with only a partial
match, it will first return you to the last known
match.
RET picks the selected match This also terminates
Isearch. But it leaves you at the match you are at,
and it drops a mark at your original location so
you can return to your former location with C-u
C-<SPC>.
Isearch is so good that I strongly encourage you to use it for
movement as it is one of the quickest ways of moving around
text in Emacs. It is also one of my most used commands. I
use it hundreds of times a day, if not more. It takes a bit
of practice to commit the Isearch behavior to muscle mem-
ory but it is so worth it! It has two accessible keys – C-s and
C-r – and it is visual and instantaneous. There are no distrac-
tions and no ceremony, no modal dialog that pops up and
obscures your buffer, no fiddly radio buttons to change the
search direction, no mouse needed and no tabbing required
to operate it either.
Case folding
157

## [p.158]
The Theory of Movement
By default, Isearches are not case sensitive; low-
ercase searches will match uppercase and mixed
case. However, when you use one or more up-
percase letters in your search, Emacs will auto-
matically switch to a case-sensitive search. It’s
called case folding.
This is another one of those strange Emacs
features that nobody would think to implement
elsewhere. You might be looking for an upper-
case string, but your search string doesn’t have
to be. And if you really need case-sensitivity,
all you have to do is spell out the uppercase or
mixed case name and Emacs will only look for
literal matches. Of course, if you are looking for
only lowercase matches but no upper- or mixed
case matches, then you have no choice but to
disable case folding or use Isearch’s toggles to
temporarily enable case-sensitivity.
If you prefer, you can disable case folding
entirely:
M-x customize-option case-fold-search
Once you start using Isearch you’ll want to use its history
(formally called search ring) features more:
Isearch Key Binding
Purpose
M-n
Move to next item in search history
M-p
Move to previous item in search history
C-M-i
“TAB”-complete search string against
158

## [p.159]
The Theory of Movement
Isearch Key Binding
Purpose
previous search ring
C-s C-s
Begins Isearch against last search
string
C-r C-r
Begins backward Isearch against last
search string
The first two should be self-explanatory by now – as they
are universally available in all Emacs completions – but the
third one warrants a closer look.
“TAB”-completion in Emacs
In Emacs, C-M-i is another “TAB”-completion
mechanism not unlike the one you see when
you press TAB in the M-x prompt. In modes that
support it – and do not forget, when you run
Isearch you are essentially interacting with a
mode – the command is typically bound to
complete-symbol, a generic completion mecha-
nism that looks at the text at point and tries to
complete it against a known set of completions.
In Isearch’s case, pressing C-M-i will also trigger
the completion engine – but a different one
built for Isearch given its specialized nature –
but this time it’ll compare your Isearch search
string against your search history. Try it out.
Searching for strings at point is such a common occurrence
that there are dedicated commands to help you do just that:
159

## [p.160]
The Theory of Movement
Isearch Key Binding
Purpose
C-w
Add word at point to search string
C-M-y
Add character at point to search string
M-s C-e
Add rest of line at point to search
string
C-y
Yank (“paste”) from clipboard
to search string
It’s common that you will find yourself at a word you want
to search for and, to save the hassle of typing it in manually,
you can just type C-w. Repeated invocations will add subse-
quent words to the search string. I find C-M-y (which adds
one character at a time) to be of marginal use to most, but
if you edit a lot of text with foreign characters, you should
give it a try.
Isearch is an inclusive search and it will generally err on the
side of caution and match things that a more traditional,
stricter search, would not. You can control how Isearch
behaves using its toggles:
Isearch Key Binding
Purpose
M-s c
Toggles case-sensitivity
M-s r
Toggles regular-expression mode
M-s w
Toggles word mode
M-s _
Toggles symbol mode
M-s <SPC>
Toggles lax whitespace matching
M-s '
Toggles character folding
160

## [p.161]
The Theory of Movement
Each toggle command only affects the current Isearch and
will not persist.
The case-sensitivity toggle (M-s c) simply turns on strict case-
sensitive matching — for when you have case folding on by
default and you only occasionally need strict case search.
Toggling regular-expression mode with M-s r is akin to acti-
vating regexp Isearch with C-M-s or C-M-r, and vice versa.
The word and symbol toggles (M-s w and M-s _) alter Isearch
so word and symbol delimiters like . and - freely match
other delimiters.
For instance, consider a buffer with this text:
this-is-a-hyphenated-string
Searching for hyphenated string with C-s alone will not
yield a match, but if you re-run the search with C-s and
then toggle word search mode with M-s w, it will. Word
search is especially practical in programming languages
where you want to match two successive words separated
by (possibly unknown) word-delimiting characters, like
this C example:
foo->bar = 42;
Searching for foo bar will match the element access above if
you toggle word search with M-s w.
Isearch can fold characters with M-s '. It’s neat: when you
search for a Emacs will attempt to match characters like á or
161

## [p.162]
The Theory of Movement
å; it works for a wide range of characters. You can enable it
by default by Customizing search-default-mode.
Some of the toggles and commands I have covered are so
frequent that they have their own global keybindings:
Key Binding
Purpose
M-s w
Isearch forward for word
M-s _
Isearch forward for symbol
M-s .
Isearch forward for symbol at point
M-s M-.
Isearch forward for thing at point (Emacs 28)
You should recognize the first two as they are the same key
bindings available to you inside Isearch itself. M-s . is only
available as a global key binding. It begins a forward Isearch
for the symbol at point. The definition of a symbol is mode-
dependent, but Emacs is usually smart enough to deduce
where the symbol begins and ends.
In a similar vein is M-s M-. which finds the thing at point.
What that thing is, is contextual, and is controlled by the cus-
tomizable option isearch-forward-thing-at-point. By de-
fault it’ll check for a region selection; an url; a symbol; or
an s-expression, in that order. That makes it a convenient
one-size-fits-all tool to grab the thing you’re most likely in-
terested in.
If you want to Isearch with an active region, then it stands
to reason you’d probably want to use that as an isearch query
also. The same holds for the other choices.
Thing at Point
162

## [p.163]
The Theory of Movement
In Emacs, the thing at point is an extensible
system for extracting “interesting” text around
point. It’s a system package authors can tap into
to extend, and it’s used in many parts of Emacs.
Learn Isearch It is a powerful search tool in its own right,
but it also lets you move around the buffer quickly by
searching for words near where you want to go. Tradi-
tional text editors and IDEs attach too much edifice and
complexity to a traditional “find text” UI. In Emacs,
Isearch nearly eliminates the visual clutterand context
switching and hence you keep your tempo.
163

## [p.164]
The Theory of Movement
Occur: Print and Edit lines matching an
expression
Occur mode is a grep-like utility built into Emacs. Unlike
grep, it has far fewer functions and will by default only op-
erate on the current buffer. What makes M-x occur great is
its speed and that it comes with Emacs, so you don’t have to
164

## [p.165]
The Theory of Movement
call out to an external process. Occur will also preserve the
syntax highlighting in its match results.
Whereas Isearch incrementally walks you through every
match in a buffer, occur will instead create a new buffer
called *Occur* with all the match results in it.
You can activate occur globally and from within Isearch it-
self:
Key Binding
Purpose
M-s o
Occur mode (Outside Isearch)
M-s o
Activate occur on current search string
(Inside Isearch)
Unlike Isearch, you’re asked for a regular expression
for which to search. Occur mode searches for lines that
match the regular expression and shows you the results
in a separate buffer. Occasionally, you may want context
lines – lines before and after the matching line itself –
and you can enable them by customizing the variable
list-matching-lines-default-context-lines.
Occur mode uses hyperlinks that jump to the matching line
when you left-click it with the mouse or press RET on your
keyboard. The occur mode used in the *Occur* buffer has a
number of keys you can use:
Occur Key Binding
Purpose
M-n, M-p
Go to next and previous occurrence
<, >
Go to beginning and end of buffer
g
Revert the buffer, refreshing the
165

## [p.166]
The Theory of Movement
Occur Key Binding
Purpose
search results
q
Quits occur mode
e
Switches to occur edit mode
C-c C-c
Exits occur edit mode and
applies changes
The keys are only available in the occur buffer itself.
In Emacs, the key g will revert the buffer. What happens
when you do that depends on the mode, but it’s a common
Emacs convention to refresh the contents from the original
source. In this case, it will re-run the search on the buffer
with the same regular expression. The g command is worth
remembering as it’s such a common convention in Emacs.
The e key will switch the occur buffer to an editablestate. This
is an unbelievably powerful editing construct that lets you
edit the text in-line in the occur buffer and then commit the
changes to the original source lines by typing C-c C-c.
The main advantage of the occur mode is that you get a
second buffer with the results, usually in a second window
next to your original buffer, and an at-a-glance view of the
matches and the ability to jump between the matching lines.
However, that requires that you keep switching to the other
window to select new matches; that is not only tedious, but
it ruins your tempo. To maintain your tempo, I suggest you
learn these two commands:
166

## [p.167]
The Theory of Movement
Key Binding
Purpose
M-g M-n
Jump to next “error”
M-g M-p
Jump to previous “error”
The purpose column says “error,” but that’s because the com-
mand names are M-x next-error and M-x previous-error.
In reality, they are general-purpose commands. When you
run M-x occur (or other specialized commands in Emacs
like M-x compile or M-x grep), Emacs remembers that and
makes M-g M-n and M-g M-p go up and down that list of
matches. The great thing about these commands is you
only have to remember those two and they will work with
the last-known occur, compile or grep search you did.
Multi-Occur
You can use the occur mode on multiple buffers with multi-
occur. The command M-x multi-occur-in-matching-buffers
takes a regular expression of buffers to match – for instance
\.py$ to search all Python buffers – but otherwise works the
same as M-x occur. There is also M-x multi-occur where you
explicitly select the buffers you want to search — also of
utility, but slower to use as you have to manually select each
buffer on which to run occur.
With multi-occur you can use most of the commands I
explained earlier: that means you can edit (with e) across
the buffers you matched. Now combine it with Emacs’s
keyboard macros or search & replace and you have an
exceptionally powerful tool at your disposal.
167

## [p.168]
The Theory of Movement
Imenu: Jump to definitions
Imenu is a generic indexing framework for jumping to
points of interest in a buffer. A major mode author will
write a snippet of elisp that generates a list of points of
interest – their name and where in the buffer they occur –
so when you invoke imenu with M-x imenu, you can jump
to any one of them.
Most, but not all, major modes support imenu. For program-
ming modes, the most obvious points of interest are things
like functions and class definitions; other modes may make
use of them as well, such as mail programs or structured text
modes like Markdown or reStructuredText.
Imenu is another tool in your toolbox for medium and
long-distance movement. I find that I use it most when I am
not sure of where something is in a buffer; for jumping to
things I see on the screen, Isearch or elemental movement
commands might be better (and faster).
Curiously, Imenu was only bound to a global key binding
in Emacs 29. To access it in earlier versions of Emacs, you
must type M-x imenu. It is unfortunate that it only received
a key binding in Emacs 29 as I think it has hampered its adop-
tion. As you will see as you explore Emacs yourself, that is
a common occurrence — so common in fact that 20-year
veterans still find new things in Emacs that they had never
heard about before.
Key Binding
Purpose
M-g i
Activate Imenu (Emacs 29+)
168

## [p.169]
The Theory of Movement
The formal key binding in Emacs 29 or later is M-g i. Person-
ally, I bind imenu to M-i. That key is already in use, how-
ever. The existing command, M-x tab-to-tab-stop, will in-
sert spaces or tabs to get to the next tab stop, a concept that
dates back to – and hasn’t been used since – the era of the
typewriter.
To bind Imenu to M-i, add this to your init file:
(global-set-key (kbd "M-i") 'imenu)
Like most of Emacs’s completion prompts, Imenu only sup-
ports TAB-style completion out of the box. I recommend you
read the next chapter and use Helm’s Imenu support instead,
or explore one of the other builtin completion systems in
Emacs, like FIDO, or one of the many third-party completion
packages.
169

## [p.170]
The Theory of Movement
Helm: Incremental Completion and Selection
Helm is an amazing package. It’s a generic framework for
filter-as-you-type completion; that is, you begin typing and
Helm will automatically filter and show you what matches
— not unlike Isearch’s real-time, incremental search.
What makes Helm so fantastic is that it comes with a lot of
completion commands out of the box. My personal recom-
mendation is that you follow the installation instructions be-
low and start using Helm right away. Helm is a radical depar-
ture from Emacs’s usual low-key completion mechanism –
particularly if you already have a workflow that works for
you – but Helm’s extensive selection of completion sources
170

## [p.171]
The Theory of Movement
and its filter-as-you-type is clearly superior to Emacs’s own TAB-
based completion mechanism for many (but not all) tasks.
How to install
Helm is a third-party package and does not ship
with Emacs. There are many ways of installing
it, but this is the easiest:
1. Ensure you have followed the instructions
in The Package Manager.
2. Run M-x package-install, then enter helm
and press RET.
3. Restart your Emacs.
All Helm commands share the prefix key C-x c. I can’t say I
am a big fan of that prefix key as a lot of the keys that follow
it make it an exercise in finger contortion. It is also remark-
ably close to C-x C-c — the command that exits Emacs.
Prefix Key Binding
Purpose
C-x c
Prefix key for all Helm completion
commands.
Exploring Helm
The trick to discovering things in Emacs is to ask Emacs the
right questions. The right questions in this case are: What
commands does Helm make available to me? and Does Helm have
any key bindings?
171

## [p.172]
The Theory of Movement
Use apropos As I talked about in Apropos, apropos will list
all elisp symbols – variables, commands, elisp func-
tions, and so on – that match the pattern you give it.
In this case, asking M-x apropos-command (using C-h a)
to show you all commands that match ^helm- would be
a good place to start. Likewise, M-x apropos-variable
will do the same but for variables.
Elisp does not have namespaces so package authors pre-
fix their commands with the name of the package. As
the package name is Helm, it makes sense to use apropos
to find commands beginning with helm- — or more
precisely as the regular expression ^helm-.
Coincidentally, Helm has its own apropos comple-
tion engine:
M-x helm-apropos. It will complete
commands and variables & functions — make sure
you only look in the Commands header as Functions
are internal elisp functions not meant for general use.
Describe the prefix key I mentioned earlier that Helm has
itsownprefixkey, C-x c.InTheDescribeSystem,you
can tell Emacs to list all key bindings in a prefix key by
finishing a prefix key with C-h: C-x c C-h.
The two methods yield slightly different answers – because
you are in fact asking two different questions – so you
should do both.
And finally:
• M-x apropos-command (C-h a) is not limited to com-
mands bound to a prefix key and it will happily show
172

## [p.173]
The Theory of Movement
you commands that are unbound (or even completely
unrelated if your search pattern is too generic) —
but this is still a great way of discovering hidden
commands, bound or not.
• Describing a prefix key with C-h will only show you
the commands bound to that prefix key. Occasionally,
you will discover commands that, although bound to
that prefix key, have nothing to do with the other com-
mands.
Helm Bindings
Because of the sheer number of Helm commands, I will list
the ones I think are the most important. I encourage you
to follow the suggestions in Exploring Helm and explore
Emacs and Helm yourself.
Before I do that, I should talk about Helm actions. In Helm,
you can also carry out actions against the matches; the ac-
tions available depend entirely on the completion you are
doing.
Helm has its own set of keys that you need to learn:
Helm Key Binding
Purpose
RET
Primary action
C-e
Secondary action
C-j
Tertiary action
TAB
Switch to action selector
C-n, C-p
Next and previous candidate
C-v, M-v
Page down/up
M-<, M->
Beginning and end of completion list
173

## [p.174]
The Theory of Movement
RET is the primary (and most common) action you’d want to
carry out on the selected candidate. Usually, it will jump to,
open or display the candidate. The secondary action, if there
is one, is bound to C-e which you may remember is an ele-
mental movement command that jumps to end of the line; the
command will still do that in Helm but only if your point
is not at the end of the line — if it is, it acts as the secondary
action.
Exiting Helm
To quickly exit Helm, press C-g, the universal
get-out-of-anything key.
The TAB key will switch to the action selector and list all
available actions for the selected candidate. Like the Helm
completion interface, the action interface is also filter-as-you-
type.
Here are some of the more interesting Helm completion en-
gines:
Key Binding
Purpose
C-x c b
Resumes last Helm command
C-x c /
Invokes the command line utility find
on the active buffer’s current directory
C-x c a
Completes M-x apropos results
C-x c m
Completion engine for the man page
program
C-x c i
Lists completions sourced from
M-x imenu or Semantic
C-x c r
Interactive regular expression builder
174

## [p.175]
The Theory of Movement
Key Binding
Purpose
C-x c h r
Search Emacs topics in M-x info
C-x c M-x
List completions sourced from M-x
C-x c M-s o
Use Helm to match M-x occur patterns
C-x c C-c g
Show matches from Google Suggest
Some of the Helm commands have positively byzantine key
bindings, like C-x c C-c g to show Google Suggest matches.
Even by Emacs standards, they’re obtuse. You can rebind
them, and pick and choose from the ones you use the most
10 .
Learning Helm will greatly improve your Emacs experience.
It comes with a powerful fuzzy search and a large range of
ready-made completion mechanisms. It also has its own bur-
geoning ecosystem of third-party packages.
The interesting thing about Emacs is the unexpected
productivity improvements you’ll get from things like the
Google Suggest completion mechanism. Why switch to a
web browser and search in the browser when you can do
it in Emacs and get as-you-type suggestions from Google?
Pick the result you want in Helm and hit RET to search for
the match in your default browser.
10 Mastering Keybindings in Emacs is a detailed article on this subject.
175

## [p.176]
The Theory of Movement
IDO: Interactively DO Things
As I talked about in Buffer Switching Alternatives, IDO mode
is a powerful minibuffer completion engine. Helm and IDO
overlap in purpose and some prefer to use one to the exclu-
sion of the other; others prefer third-party packages; and
some (such as myself ) use a mixture of completion packages,
but for different things.
Here is a rough outline of my workflow, and how I use
them:
IDO is a distraction-free, target-aware search Unlike
Helm, IDO does not use a separate buffer (and
window) to show completion matches. Instead, it
completes in-line in your minibuffer itself. That
is often preferable for things like buffer switching
and file finding, as you roughly know where you’re
176

## [p.177]
The Theory of Movement
going and what you are looking for. That is how I
use IDO mode and I think it’s a great way to start
out; for almost everyone out there, it is certainly a
better choice than the default TAB-based completion
mechanism.
However, IDO fails when you’re not entirely sure what
you are looking for; stepping through the matches
in the minibuffer is tedious when all you want is an
overview of everything that matches your query.
Helm is for in-depth searching and completion Helm
will open a transient buffer and window to display
matches and that greatly increases visual clutter and
distraction — that is not in itself bad if you are unsure
what you are looking for. But if you know what you
are doing – for instance you are in buffer foobar.txt
and you want to open widgets.c – IDO is a better
choice as you can seamlessly switch buffers and not
suffer the visual overhead.
Indeed, if you are a touch-typist you will quickly
reach a point where you jump from buffer to buffer
without so much as glancing at the minibuffer because
your primed intuition tells you that if you type C-x b
wc, IDO will flex match to widgets.c.
Helm excels when you don’t know exactly what you’re
looking for or if you require additional, contextual
awareness of similar matches.
If you are unsure what to use, I recommend you enable IDO
mode for file finding and buffer switching by adding the fol-
lowing lines to your init file:
177

## [p.178]
The Theory of Movement
(ido-mode 1)
(setq ido-everywhere t)
(setq ido-enable-flex-matching t)
When you find files or directories (C-x C-f and C-x d) or
switch buffers (with C-x b), you will use IDO’s far superior
completion mechanism. Of course, you are free to use Helm
as well if you prefer, or as I’ve alluded to before, any number
of other completion engines. I recommend you learn just a
couple of IDO’s extensive key bindings.
File & Directory Switching
These keys are only available when you run a command that
requires you to pick a file or directory. That includes C-x
C-f and C-x d, respectively, but it also includes things like
file saving with C-x C-s:
Key Binding
Purpose
C-s and C-r
Move to the next and previous match
TAB
Traditional non-IDO TAB-completion
RET
Open selected match
C-d
Open M-x dired buffer in current
directory
//
Go to root directory /
~/
Go to home directory ~
Backspace
Delete a character or go up one
directory
178

## [p.179]
The Theory of Movement
Buffer Switching
Buffer switching is usually only encountered when you type
C-x b:
Key Binding
Purpose
C-s and C-r
Move to the next and previous match
TAB
Traditional non-IDO TAB-completion
RET
Switch active buffer to selected match
Further reading
I recommend you read my article Introduction to
Ido Mode11 on my website for further, in-depth
information on how to use IDO mode.
Meet FIDO
IDO is nice, but its Achilles’ heel is that it works (without re-
sorting to gnarly hacks) for a limited set of completions: files
and buffers, mostly. IDO is old, and it predates a large range of
modernizations that have taken place in Emacs over the last
10-15 years, and so it works by supplanting (rather than ex-
tending) the completion machinery in Emacs. IDO remains
popular because it’s fast; works well enough; and, rather im-
portantly, comes with a large range of context-specific key
bindings. The much-improved completion system in Emacs
does not support that workflow.
11 https://www.masteringemacs.org/article/
introduction-to-ido-mode
179

## [p.180]
The Theory of Movement
If you like the cut of IDO’s jib but want a more modern inter-
pretation, you should try FIDO, a replacement that emulates
much of what makes IDO great. You can try it – but be sure
to disable IDO first! – in one of two modes:
Command
Purpose
M-x fido-mode
Enable FIDO mode globally
M-x fido-vertical-mode
Enable FIDO mode globally, but use
a vertical completion list style
Run either command and take FIDO for a spin. One benefit
of FIDO is that it works everywhere. You can make it perma-
nent by customizing fido-mode (or its vertical variant) with
M-x customize-option.
Grep: Searching the file system
Searching for things on your filesystem is such a common
activity that Emacs has a host of specialized commands to
do just that.
grep in Microsoft Windows
There is no like-for-like grep program in Win-
dows – and the built-in one findstr, though
powerful, is not supported out of the box
by Emacs – so I recommend you install the
cross-compiled Windows versions of the GNU
Coreutils.12 They work splendidly in Windows
12 http://gnuwin32.sourceforge.net/packages/coreutils.htm
180

## [p.181]
The Theory of Movement
and they give you a reasonable Linux command
line facsimile in Windows.
How you interact with grep – or more generally with any ex-
ternal tool – depends on your editor. Many Vim users would
exit Vim or use a tool like tmux or screen and switch to a
terminal and run the command(s) and then return to Vim.
Emacs users prefer tools they can assimilate into Emacs. Us-
ing grep from inside Emacs is a major productivity-booster
as you’ll soon see.
Emacs supports a large array of grep and grep-derivative
commands. None are bound to a key by default so you will
have to call the commands directly with M-x and later bind
the ones you use frequently to keys:
Command
Purpose
M-x grep
Prompts for arguments to pass to grep
M-x grep-find
Prompts for arguments to pass to grep
and find
M-x lgrep
Prompts for query and glob pattern to
search for with grep
M-x rgrep
Prompts for query and glob pattern
then recursively searches with grep
and find
M-x rzgrep
Like M-x rgrep but searches
compressed gzip files
The grep commands fall into two categories:
Low-level commands like
M-x grep and
M-x grep-find.
181

## [p.182]
The Theory of Movement
They supply you with a suggested grep command
string and all you have to do is add the search pattern
and any additional options you require.
I don’t use them frequently. I usually want to search
for a pattern in a group of files and these commands
are too low-level for that. Occasionally, I want to call
grep with specific options and in that case I have no
choice but to use M-x grep or M-x grep-find.
High-level commands like M-x lgrep, M-x rgrep and M-x
rzgrep. They hide the command string completely
and instead ask you for the files you want to search
and the search string you want to match.
Emacs will also cleverly suggest a file type based on
your current buffer’s file type. Emacs will also look at
the current symbol your point is on and ask if you
want to search for that. That is convenient because
you often find yourself on, or near, an identifier or
word you want to search for. In that case you can type
M-x rgrep and RET twice to accept the defaults.
Grep Guesswork
The high-level commands – particularly rgrep – do a lot of
clever behind-the-scenes guesswork when it calls out to find.
First of all, Emacs runs on any number of platforms and it
has to work consistently on all of them. Not all platforms
come with xargs, so Emacs will check for this and use find’s
own -exec switch instead. Quoting and escaping characters
in strings vary on platforms and shells — and Emacs needs
to work with all of them.
182

## [p.183]
The Theory of Movement
For Windows Users
On Windows, there is already a program called
find. To override the default choice in Emacs,
you should add this to your init file, making sure
to change C:\\gnuwin32\\bin\\ to the location
of GNU find and then restart Emacs:
(setenv "PATH" (concat "C:\\gnuwin32\\bin\\"
path-separator
(getenv "PATH")))
Another arrow in Emacs’s quiver is the ability to automati-
cally pass negative matches to find. For instance, you don’t
want to search source control directories like .git or trash
files that yield false positives.
A lot of people use tools like ack or rg for the ease of which
you can include or exclude file patterns — but Emacs thank-
fully automates that tedium.
I encourage you to browse the grep category with Customize
and configure it to your liking:
M-x customize-group grep
Using the Grep Interface
Key Binding
Purpose
M-g M-n
Jump to next match
M-g M-p
Jump to previous match
183

## [p.184]
The Theory of Movement
Like I mentioned when I talked about M-x occur, you can
re-use the jump commands. As before, they are global and
work across buffer boundaries. They are worth knowing as
you can quickly and easily jump between matches in a *grep*
buffer. Emacs will open the files and jump to the right line if
they are not already open (and if they are, Emacs will simply
switch to the already-open file.)
Grepping in Emacs
Like everything in Emacs, it comes down to
modes and the major mode for grep is named –
you guessed it – grep-mode. Because the buffer is
the universal data structure of Emacs, all it has
to do is pipe the output from grep to a buffer
named *grep*, followed by a call to grep-mode.
When activated, grep-mode will highlight the
matches and hyperlink them to the line number
and filename so you can jump around.
If you look closely, the output in a *grep* buffer
looks identical to that of grep itself! You can test
this by opening a blank buffer (C-x b and then
pick a name not in use) and enter something like
this:
my_file.txt:10:This does not exist!
and then type
M-x grep-mode and watch as
Emacs will highlight the match as though it
were real output from grep. This is a common
pattern in Emacs: re-using the raw output from
a command is low-tech, but effective!
184

## [p.185]
The Theory of Movement
Other Movement Commands
These movement commands are of limited day-to-day use
for most Emacs users. They have their place, and some are
worth incorporating into your workflow once you are com-
fortable using all the other commands in this chapter.
Key Binding
Purpose
M-r
Re-positions the point to the top left,
middle left, or bottom left
C-l
Re-centers the point to the middle, top, or
bottom in the buffer
C-M-l
Re-positions the comment or definition
so it is in view in the buffer
C-x C-n
Sets the goal column, the horizontal
position for the point
C-u C-x C-n
Resets the goal column, the horizontal
position for the point
M-g M-g
Go to line
M-g TAB
Go to column
M-g c
Go to character position
M-r and C-l are functionally similar. M-r will first move your
pointtothebeginningofthelineandthenalternatebetween
the top, the middle and the bottom of the buffer. All it does
is toggle between those three locations. C-l is similar only it
will scroll your window so the line point is on is re-centered as
the top, middle, or bottom. C-M-l is similar only it will intel-
ligently try and re-position the window so the comment or
definition point belongs to is visible in the buffer. In other
185

## [p.186]
The Theory of Movement
words, it will try and scroll things into view.
I use C-l all the time. I use it to recenter the line I’m on so
I can see more of the buffer above or below the line I am on.
I encourage you to try out M-r and C-l.
The goal column command C-x C-n is of limited interest to
most people. When you move up or down a line, Emacs will
try to maintain your horizontal position as you move from
one line to the next. If you have a goal column set, Emacs
will not do that and instead make your point’s horizontal po-
sition match the goal column. So if you set the goal column
to 10 – by putting point on the 10th character – Emacs will
try (if the line is long enough!) to ensure your point is always
placed at the tenth character. To disable goal column, type
C-u C-x C-n.
Jumping to a line is something you’d want to do regularly.
But because of things like Emacs’s interactive compilation
mode and built-in support for things like grep, you don’t
have to jump to explicit lines as often as you’d have to if
you used a simpler editor. The command, bound to M-g M-g,
works exactly as you would expect: it asks you for a line to
which to jump. You can also give it a prefix argument, for
instance M-5 M-5 M-g M-g, to jump to the 55th line — and
make sure you use the M- digit argument to maintain your
tempo.
The command M-g TAB does the same only it jumps to a par-
ticular column position instead. M-g c jumps to the absolute
position in the buffer starting from the beginning of the
buffer. If you want to jump to the 42nd character in a buffer,
you’d type M-g c or M-4 M-2 M-g c.
186

## [p.187]
The Theory of Movement
Conclusion
As the previous sub-chapters have shown, there are a multi-
tude of ways you can move around in Emacs. Emacs is often
lambasted for being an operating system but a terrible text
editor, but that could not be farther from the truth; Emacs
is a highly sophisticated text editor and it easily rivals Vim
in capability — even if the two editors are functionally dif-
ferent in their approach. Emacs’s modifier keys are a form
of transient modality. Emacs is distinctly modal as your com-
mands change with the modifier keys and remain so until
you release the modifier keys. The one thing that will make
the biggest difference is remapping Caps Lock to Control:
I could not live without this, even outside of Emacs. The
control keys are awkwardly placed if you’re a touch typist.
Mechanical Keyboards in 2024 and Beyond
I still recommend you rebind Caps Lock to Con-
trol if you use an ‘ordinary’ keyboard. If you’re
vested in typing on your computer all day long
you should consider a programmable, mechani-
cal keyboard. Most are made with high-quality
mechanical key switches, unlike the vast major-
ity of consumer keyboards.
Some come with thumb keys – perfect for the
Alt, Ctrl, Enter and Space keys – that ease the
burden of holding down one or more keys at a
time.
I switched years ago myself, and I highly
recommend you find a keyboard that looks and
187

## [p.188]
The Theory of Movement
feels right for you. Many come with customiz-
able firmware. For instance, on my keyboard,
tapping a thumb key yields a space character;
holding it down makes it behave like M-S (Alt
and Shift together) so I can more easily type
key bindings that require those two keyboard
modifiers. The possibilities are endless.
There is also a lot of symmetry to Emacs’s commands, par-
ticularly the elemental movement commands. Not all key
bindings make sense and there are silly oversights like not
binding M-x imenu to a key.
If you are new to Emacs, I suggest you keep using the arrow
keys. You can adopt Emacs’s movement commands one key
at a time. Eventually, you will slowly adopt certain Emacs-
isms and you’ll soon realize that moving your right hand off
the home row to use the arrow keys is slowing you down.
My next suggestion is to experiment. Keep referring back
to the book until it’s muscle memory; keep experimenting
with different key combinations and train your brain to rec-
ognize patterns. It’s all about muscle memory and pattern
matching — knowing that if you do this command, you’ll
get that outcome. Nobody mastered Emacs overnight and
Emacs mastery is a red herring anyway; it means a hundred
things to a hundred people.
Over the course of the chapter, I showed you how to look
things up using Emacs’s internal documentation – particu-
larly apropos, C-h and the describe system – and that more than
anything will help you “master” Emacs. Forgetting the
188

## [p.189]
The Theory of Movement
name of a command or the key it is bound to is immaterial
if you know how to look up the answer in Emacs.
My final advice is about advancing the speed with which
you can edit and move around. Every time you do some-
thing that you think you can do in a smarter or more efficient
way — have another read through the book or search the In-
ternet for advice. Most of my own techniques and workflow
grew organically as I realized that particular problems I kept
facing had solutions other than the naive, manual way.
The next chapter covers editing, and it will take everything
we’ve talked about movement and asking Emacs questions
and combine them in novel ways.
189

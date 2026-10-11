# 移动理论（二）：基本移动、书签寄存器、选区

> 原书来源：Mastering Emacs (Eli Spare)，第 114–153 页。
> 覆盖范围：Elemental Movement, Bookmarks and Registers, Selections and Regions

## [p.114]
The Theory of Movement
buffers relevant to the window you call it from. By default
that is a list of recent buffers, but you can customize that
with
M-x customize-option tab-line-tabs-function and,
say, limit it to buffers of the same major mode.
Elemental Movement
Navigation Keys
The most elemental movement commands available to
you – and indeed, to every editor – are the humble arrow
keys. They work as you would expect, and if you’re new
to Emacs, I recommend you use them until you learn the
more advanced movement commands.
As with other editors, you can combine the arrow keys –
written as <left>, <right>, <up>, and <down> – with the con-
trol key to move by word. Simultaneously, the other naviga-
tion keys, like page up and page down, also work in Emacs.
Key Binding
Purpose
<left>, …
Arrow keys move by character in all
four directions
C-<left>, …
As above, but by word
<insert>
Insert key. Activates overwrite-mode
<delete>
Delete key. Deletes the character after
point
<prior>,
Page up and Page down move up and down
<next>
nearly one full page
<home>, <end>
Moves to the beginning or end of line
114

## [p.115]
The Theory of Movement
Once you’re comfortable with the basics of Emacs – han-
dling buffers, splitting and deleting windows, saving and
opening files – you should move away from using the navi-
gation keys. Though they serve their purpose well, they are
too far away from the home row, and moving your right hand
away from the homerow just to move the point around on the
screen is time consuming.
By the way
The page up/down buttons will scroll up or
down a screenful of text, retaining 2 lines of
text for context. You can change the amount of
overlap when you page through text by altering
the variable next-screen-context-lines directly
in your init file or by using Emacs’s customize
interface, like so: M-x customize-option, then
enter next-screen-context-lines.
If you regularly use shells like bash or other GNU readline-
enabled terminal applications, then good news for you: by
default they use Emacs-style keys. Try it, M-f moves forward
by word. In fact, dozens of Emacs’s most commonly-used
commands5 exist in GNU readline, meaning the mental con-
text switch is minimal and every terminal program that uses read-
line supports them.
5 The man page on readline has a complete list. But why not read the
man page in Emacs? M-x man readline
115

## [p.116]
The Theory of Movement
Moving by Character
The arrow key equivalents in Emacs will seem positively
strange when you first encounter them. A lot of people won-
der why Emacs would bind an action as common as moving
forward a character to C-f. The fact is if you know Emacs,
you’ll almost never move around by character.
Moving by character – and also by line, as that is technically
the smallest unit you can move up or down – is the small-
est atomic movement you can make in a buffer. Character
movement is for finesse; made for precision movement, if
you like. Moving around a buffer by character is inefficient
and tedious; limited by the speed of your keyboard’s repeat
speed or how fast you can type it. That’s slow, and that slow-
ness adds up as we often spend as much time moving around as
we do editing text. You should only use character movement
when it’s the most efficient command available. Moving by
word is great, but that won’t help you if you want to move
2 characters into a word.
The four basic movement commands are:
Key Binding
Purpose
C-f
Move forward by character
C-b
Move backward by character
C-p
Move to previous line
C-n
Move to next line
As you can see, mnemonically, the assignments make sense
– p for previous, b for backwards – and all are bound under
the C- modifier.
116

## [p.117]
The Theory of Movement
You can apply universal arguments to the character keys
and they will work as you expect. Type C-8 C-f and you
will move the point forward eight characters. You can even
combine the negative argument to reverse the direction
of the command — that may not make much sense with
movement keys, but some commands come with a forward
and backward command. Most act in just in one direction
– forward, that is – and the negative argument is the only
way to change this direction.
Learning Emacs’s own movement commands (as opposed
to using the navigation keys to the right on your keyboard)
makes sense when you look at how Emacs’s other move-
ment commands work. I see experienced Emacs users
execute choreographed sequences of commands to do
interesting and complex actions only to stop dead in their
tracks to move their right hand away from the home row
and move the point around by character. At some point
you will realize how jarring (and how much it affects your
speed) it is and switch to Emacs’s own commands.
Moving by Line
The <home> and <end> keys move your point to the beginning
and end of a line, respectively, and the Emacs equivalents
are C-a and C-e. Both C-a and C-e behave exactly the same
as <home> and <end> (indeed, both sets of keys are bound to
the same command) but I cover the definition of a line in the
next chapter.
117

## [p.118]
The Theory of Movement
Key Binding
Purpose
C-a
Moves point to the beginning of the line
C-e
Moves point to the end of the line
M-m
Moves point to the first non-whitespace
character on this line
The last command, M-m, is of general utility to all program-
mers. When you type M-m, the point will move to the be-
ginning of the line and move forward until it encounters a
non-whitespace character:
function foo() {
return 42;█
}
After you type M-m:
function foo() {
█return 42;
}
If you’re on a line without indentation, the command will
simply go to the beginning of the line. That means M-m is
worth internalizing instead of C-a for most use cases.
Screen, Logical and Visual Lines
Emacs will, by default, wrap long lines to the right edge of
the window, but that raises an important question: where
does a line begin and end when it wraps?
118

## [p.119]
The Theory of Movement
The answer, unfortunately, requires a bit of explaining, and
the terminology? Well, it’s jumbled:
Visual lines A visual line is defined as What You See. If you
open a file and a long line spans three wrapped lines in
your buffer, then you have three visual lines, each of
which is treated as a separate and distinct line by Emacs,
even if the underlying file has just one.
Logical lines A logical line is the opposite of a visual line.
Logical lines are governed by the content of the buffer
and nothing else; word wrapped or not, one long line
in a file is treated as one long line in Emacs.
Screen lines In some parts of Emacs’s documentation, you
may see the term screen lines used in conjunction with
logical lines. A screen line is identical to a visual line and
the terms are used interchangeably.
Historically, when Emacs wrapped a long line the C-p and
C-n commands for moving up or down a line didn’t change.
A long line (called a logical line) wrapped into three lines
(called visual lines) would still count as a single (logical)
line for moving up or down by line; the end result is that
you couldn’t use the line commands to move by visual lines.
Whether it was The Right Way was a polarizing thing,
indeed. You either loved it… or you altered Emacs.
And most people altered Emacs. The end result is today,
in the latest versions of Emacs, the previous/next line
commands move by visual lines. You can switch to the old be-
havior by typing M-x customize-option line-move-visual.
119

## [p.120]
The Theory of Movement
Adding to the complexity is the addition of Visual Line Mode,
a minor mode that builds on the concept of visual lines with
additional functionality.
Visual Line Mode wraps by word boundary resulting in
“cleaner” line wrapping like what you’d see in a traditional
word processor. The minor mode will also disable the
fringe indicators.
Additionally, Visual Line Mode replaces a number of move-
ment and editing commands with visual equivalents. C-p
and C-n will behave as they do in default Emacs installations
with the line-move-visual option enabled. Furthermore,
commands like moving to the beginning and end of a line
(with C-a and C-e) now work on visual lines instead of logical
lines. The kill command (bound to C-k, but we haven’t
covered that command yet!) will also work on visual lines.
If you want this behavior – and I encourage you to try it out
and see if it fits your workflow – you can enable it globally
with M-x customize-option global-visual-line-mode or in
a buffer at a time by typing M-x visual-line-mode.
What if you don’t want word wrapping? You can toggle
word wrapping – called truncation in Emacs – with
M-x toggle-truncate-lines.
Displaying Line and Column Numbers
The
display
of
line
numbers
is
a
workflow
that
some people cannot live without. It’s not enabled
by default, but you can enable it permanently with
120

## [p.121]
The Theory of Movement
M-x customize-option global-display-line-numbers-mode
or M-x customize-option display-line-numbers-mode.
The feature is extensible, as you’d expect, and comes
with a number of default line number counting meth-
ods that you can configure with
M-x customize-group
display-line-numbers. Both relative and absolute numbers
are possible, and you can configure a number of display
options that aid in counting and executing commands on
lines.
If you only want to see the current line number you’re on,
you can enable M-x line-number-mode instead. It displays
the current line your point is on in the mode line. Likewise,
there is also M-x column-number-mode to show the column
offset of the current line point is on.
Moving by Word
Like character movement, moving by words is almost identi-
cal; the mnemonics are the same for backward and forward
character, replacing only the C- modifier with M-.
Key Binding
Purpose
M-f
Move forward by word
M-b
Move backward by word
If you’ve used other editors, the equivalent arrow keys are
C-<left> and C-<right>, and as I mentioned earlier they are
also available to you in Emacs. In Emacs, word movement is
rather complex behind the scenes, and the exact behavior of
121

## [p.122]
The Theory of Movement
word movement is dictated by the major mode you’re using.
What Constitutes a Word?
What is a word? Simply thinking of it as a series of charac-
ters separated by whitespace is what most people think – and
therefore expect – but in Emacs the truth is a lot more com-
plicated.
Mode writers in Emacs make assumptions about the
nature of the text in the buffer. What you would write in
M-x text-mode is different – and treated differently – from
what you’d write in M-x python-mode. So, mode authors
need a way of saying that in text-mode the period ‘.’ is a
sentence separator and an attribute separator in Python.
Indeed, every character – printable characters, including
Unicode code points – are given a meaning by the mode
author, directly or indirectly, in a registry that maps the
characters to a particular syntactic meaning. This registry is
called a syntax table, a concept that I will refer back to several
times to help you understand how it affects movement and
editing, but is otherwise only of interest to elisp hackers
and mode writers.
The syntax table keeps track of things like What characters
are used for comments? or What characters make up a word? and,
although obscured from view, affects every part of Emacs.
The syntax table alone decides the makeup of a word (or
symbol, punctuation, comment, etc.) as a syntactic unit. So
when you move the point around on the screen, it moves
according to the syntax table and the general rules governing
forward-word and backward-word.
122

## [p.123]
The Theory of Movement
The syntax table
Every editor has an equivalent of Emacs’s syntax
table, but what sets Emacs apart from other edi-
tors is that you can inspect and change the syntax
table, which in turn will affect how your point
movesacrossthescreenwhenyouinvokecertain
commands.
You can view your current buffer’s syntax table
by typing C-h s. In it you will see a human read-
able version of the characters and their assigned
syntax class.
Movement Asymmetry
One more thing you should know about word movement
is that it’s not symmetric: typing M-f followed by M-b – in
theory it should take you back to your old position – is not
guaranteed. Emacs will cleverly skip symbols and punctuation
it encounters in the direction (forward or backward) you’re
moving.
Consider what happens when you type M-f to move forward
one word:
Before: Hello, █World.
After: Hello, World█.
Because the characters succeeding the point, █, are all alpha-
betical characters, the word command behaves as you would
expect. Now look at what happens if we move the point to
the end of the line and type M-b to move backward one word:
123

## [p.124]
The Theory of Movement
Before: Hello, World.█
After: Hello, █World.
The word command is smart enough to realize that, al-
though a period is not a word character, it should simply
ignore it as there is a word immediately before the punctuation.
Typing M-f after we type M-b will not return us to the place
we started:
Before: Hello, █World.
After: Hello, World█.
This reinforces my point that word commands are not sym-
metric. That will take a bit of getting used to. Emacs will
generally ignore non-word characters immediately following
the point in the direction you are travelling. For instance,
we skipped over the period, ., because it was a non-word char-
acter and it was the first character the point would encounter
going backwards. The reason for this behavior is simple: if
Emacs didn’t do this, then every non-word character the word
commands would encounter, in both text and code, would
count as a word of its own and end the movement command.
Here is a more extreme example — but one you may well
encounter in source code:
print(add_two(num_table[10]))█
The point above is at the end of the line and if you type M-b
and move backward one word, you end up right before 10:
124

## [p.125]
The Theory of Movement
print(add_two(num_table[█10]))
This is because, as before, Emacs ignores symbols and punctu-
ation if, and only if, it encounters them before it has encoun-
tered a word character. Moving forward again does not take
us back to the end of the line as we are already at a word:
print(add_two(num_table[10█]))
So, you might be wondering why this is a good thing. For
starters, you can follow up the original M-b with M-d to kill
the number 10 and because of the asymmetry you don’t
kill the ])) symbols (but much more on the kill commands
later.) Another reason is that it just does not make sense to
think of a word as separated by just white spaces — it raises
too many questions. What if there are many whitespaces
in a row, and what about punctuation and symbols? When
you have to navigate a mix of symbols and text, like most
source code is, Emacs’s behavior is perfectly sensible; keep
tapping M-b and you move back consecutive words of text but
you conveniently skip any symbols you encounter in the
direction of travel. The one thing people find confusing is
the asymmetry; the rules seem insensible — but now that
you know how Emacs moves, its behavior should make a
lot more sense.
Sub- and Superword Movement
If you edit a lot of code with CamelCase, you may want your
movement and edit commands to treat each sub-word – de-
lineated by a capitalized letter – as its own word. Simultane-
125

## [p.126]
The Theory of Movement
ously, you may want the opposite: that text written_like_-
this which Emacs’s word movement commands usually –
but again this is all down to the syntax table and vagaries of
the major mode – treat as three distinct words (written, like,
and this) instead of just one.
Command
Purpose
M-x subword-mode
Minor mode that treats CamelCase
as distinct words
M-x superword-mode
Minor mode that treats snake_case
as one word
Global minor modes
There are global modes available for both and
you can enable them by typing:
M-x customize-option global-subword-mode
M-x customize-option global-superword-mode
When you enable M-x subword-mode, you enable special
movement, transpose and kill commands that operate on
each individual, capitalized word in CamelCase. If you write
a lot of code in languages that use CamelCase, you’ll like
subword mode.
Glasses mode
Thereisawhimsicalminormode, M-x glasses-mode,
that visually (it does not alter your buffer text)
separates CamelCase words into Camel_Case.
126

## [p.127]
The Theory of Movement
The superword command, M-x superword-mode, is similar
but does the opposite: it rewires symbols (which usually, but
not always, include the underscore) so they’re considered
part of a word. Note that this command is not perfect.
Major mode authors decide what syntax class a character
like _ or . should fall under, and if they don’t set a character
like _ to be a symbol, the command will not work.
Moving by S-Expressions
Perhaps the most useful – but underused – feature in Emacs
is the ability to move by s-expression (or just sexp.) The cryp-
tic name deserves an explanation: it’s a LISP term that, today,
covers a wide range of commands that operate on balanced
expressions.
Balanced expressions typically include:
Strings Programming languages being the primary exam-
ple of strings, which are balanced expressions because
they begin and end with " or '.
Brackets In most major modes brackets are considered bal-
anced as they have defined open and close characters:
[ and ], ( and ), { and }, < and >.
Balanced expressions can span multiple lines – multi-line
strings for instance – and Emacs knows this.
Whether a particular set of characters defines a balanced ex-
pression will depend on your major mode, and the major
mode in turn will define these characteristics in the syntax
table I talked about earlier.
127

## [p.128]
The Theory of Movement
Like the word and character commands, these follow the
same mnemonic as before but with a different modifier. This
time it’s C-M-.
Key Binding
Purpose
C-M-f
Move forward by s-expression
C-M-b
Move backward by s-expression
I consider these commands to be some of the most impor-
tant to learn if you’re a programmer. Look where the point
moves when you press C-M-f:
d = █{
'Hello': 'World',
'Foo': 'Bar',
}
After
d = {
'Hello': 'World',
'Foo': 'Bar',
}█
Emacs knows that { and } in python-mode is a balanced expres-
sion – because of the syntax table – and thus treats { and }
as a balanced expression, and immediately moves to the end
brace when you type C-M-f.
Once you start thinking about code in terms of balanced ex-
pressions, you’ll see them everywhere. It’s not just in LISP
128

## [p.129]
The Theory of Movement
that you’ll find them useful; almost all major modes are full
of balanced expressions — and as an added bonus, the s-expr
movement commands act like the word commands when
you invoke them on “unbalanced” expressions such as reg-
ular text.
It’s absolutely vital that you learn how to use these com-
mands.
Down and Up List
Key Binding
Purpose
C-M-d
Move down into a list
C-M-u
Move up out of a list
Like the s-expression movement commands, the list com-
mands were meant for LISP but have found a life outside that
language. When youpress C-M-d, the point will jump into the
nearest balanced expression of parentheses ahead of where
the point currently is:
Before:
█result = foo(bar())
After:
result = foo(█bar())
The point moves inside the nearest balanced expression. To
do this, the point will jump an arbitrary distance, and re-
129

## [p.130]
The Theory of Movement
peated calls will go deeper into nested structures and con-
versely C-M-u will go back up. Like the word commands, the
list commands are not symmetric; going up will take you up
one level but leave your point at the opening character:
Before:
result = foo(bar(█))
After:
result = foo(bar█())
Moving out of strings
In newer versions of Emacs, you can use C-M-u
inside a string to jump to the opening quote.
On their own, the commands do little more than jump in
and out of “list” expressions, but realize that combining this
behavior with another command, kill-sexp6 , will kill the
balanced expression in front of the point — so typing C-M-u
and C-M-k for kill-sexp will move up and kill the balanced
expression you were just in:
; Before:
(+ (* █5 2 (- 10 10))
; After going up one level with C-M-u:
6 I will talk about killing text later on in the editing chapter.
130

## [p.131]
The Theory of Movement
(+ █(* 5 2) (- 10 10))
; After killing the s-expression with C-M-k:
(+ █(- 10 10))
I use this functionality all the time; it’s one of Emacs’s hid-
den gems that will make you very productive, even if you
don’t program in LISP. For instance, languages like Python
use parentheses all over the place: for dictionaries, for tuples,
andforlists.Combinethelistcommandswith C-M-kandyou
can refactor large swathes of code easily and maintain your
tempo because most commands that work on balanced ex-
pressions are bound to the C-M- modifier.
Because C-M-d jumps into the next “list” expression follow-
ing point – regardless of where it is in the buffer – it’s a
powerful tool for moving around as well. Like everything
in Emacs, realizing the potential of a command and commit-
ting it to working memory so you use it is hard, but the
reward is well worth it.
Forward and Backward List
Two more functional navigational aids are C-M-n and C-M-p.
They move to the next or the previous list expression in the
same nested level.
Key Binding
Purpose
C-M-n
Move forward to the next list
C-M-p
Move backward to the previous list
131

## [p.132]
The Theory of Movement
For instance, here’s what happens when you type C-M-n re-
peatedly:
(+ █(* 5 2) (- 10 10))
(+ (* 5 2)█(- 10 10))
(+ (* 5 2) (- 10 10)█)
As you can see, it moves from one expression to the next,
and this includes the beginning and end of the balanced
expression. Typing C-M-n again yields an error: we have
reached the end of balanced expressions at this nested level. If
we type C-M-u to move up the list:
█(+ (* 5 2) (- 10 10))
Now, we move out of the nested expression and into its par-
ent. A subsequent call to C-M-n takes us to the end of the
balanced expression:
(+ (* 5 2) (- 10 10))█
For LISP, the commands are invaluable. Nested parentheses
indicate hierarchy so LISP hackers require an efficient set of
tools to move up, down and around balanced expressions.
For all other programming languages, the utility depends
entirely on how frequently you encounter balanced expres-
sions. In most languages – like C, Java, Python, or JavaScript
– they are very useful. And it’s an elegant way of moving be-
tween some balanced expressions like curly or square braces.
132

## [p.133]
The Theory of Movement
Other Movement Commands
I consider moving by character, line, word and s-expression
to be the most important movement commands. They have
the greatest utility across a wide range of editing tasks –
specifically programming and text editing – but there are
some movement commands that are best suited for specific
tasks — and whether or not they are to you depends
entirely on what you do.
Moving by Paragraph
Key Binding
Purpose
M-}
Move forward to end of paragraph
M-{
Move backward to start of paragraph
The definition of a paragraph depends on who you ask and
your personal style, and Emacs tries to cater to most of them.
The paragraph commands themselves rely on a set of vari-
ables that define the beginning and end of a paragraph:
Variable Name
Purpose
paragraph-start
Defines the beginning of a paragraph
using a large regular expression
paragraph-separate
Defines the paragraph separator as a
regular expression
use-hard-newlines
Set by the command
M-x use-hard-newlines and defines
whether a hard newline defines a
paragraph
133

## [p.134]
The Theory of Movement
Irecommendyoudescribethevariables(using C-h v)togeta
better picture of how Emacs’s paragraph system works. The
paragraph-start variable in particular is a jumble of regular
expressions that tries to do everything for everyone. By de-
fault, when you use M-} and M-{, Emacs will treat newline-
delimited blocks of text as a paragraph.
You can alter the behavior of the paragraph commands so
leading spaces mark the beginning of a new paragraph by
running M-x paragraph-indent-minor-mode.
The paragraph commands find their way into in program-
ming modes also. A lot of programmers group lines of code
together and separate them from each other with blank
lines, making them an ideal candidate for the paragraph
commands.
Moving by Sentence
The sentence commands share symmetry with the line com-
mands, replacing the C- modifier with M-:
Key Binding
Purpose
M-a
Move to beginning of sentence
M-e
Move to end of sentence
Like a paragraph, the definition of a sentence is a house style
that varies, but Emacs assumes you begin your sentences
with two whitespaces after a period:
This is one sentence.
This is another.
134

## [p.135]
The Theory of Movement
You can alter this behavior by customizing (with
M-x customize-option) the following variables:
Variable Name
Purpose
sentence-end-double-space
Non-nil means a single space
does not end a sentence.
sentence-end-without-period
Non-nil means a sentence will
end without a period.
sentence-end-without-space
A string of characters that
end a sentence without
requiring spaces after.
The one you are most likely to customize is sentence
-end-double-space.
Moving by Defun
The word defun is another piece of LISP arcana that stands for
define function — and in Emacs you will see it in places where
commands act on functions.
Like the sentence and line commands, the defun commands
use C-M- as their modifier:
Key Binding
Purpose
C-M-a
Move to beginning of defun
C-M-e
Move to end of defun
The defun commands move to the logical beginning or end
of the function point is in. I must point out that function is re-
135

## [p.136]
The Theory of Movement
ally a rather loose term. It doesn’t have to be a function but in
programming modes it’s usually functions, classes, or both;
for other modes, it might do other things — in reStructured-
Text, for instance, it will jump to the beginning and end of
a section or chapter.
Movingtothebeginningofdefunisreallyusefulifyouwant
to, say, quickly change the name or function arguments of
a function in a programming language.
Consider the location of point:
int addtwo(int x)
{
return x + 2█;
}
Pressing C-M-a will take us to the beginning of defun,
addtwo:
█int addtwo(int x)
{
return x + 2;
}
Subsequent calls to C-M-a will take you further and further
“up the chain” to a parent block, perhaps, or the top of the
file if you are at the root.
136

## [p.137]
The Theory of Movement
Moving by Pages
A page in Emacs is only tangentially related to the real-life
concept of a page. In Emacs, a page is anything delimited by
the character defined in the variable page-delimiter, which
by default is the control code ^L — better known as the ASCII
control code form feed. It is unlikely that you will ever use
these commands, so I would not worry about memorizing
them.
In some LISP circles, it is common to group things by pages
and as Emacs has close ties to the LISP community it comes
with a battery of commands to interact with pages.
Key Binding
Purpose
C-x ]
Moves forward one page
C-x [
Moves backward one page
Discovering the page commands
Here’s one way to find page commands: C-h a
(for M-x apropos-command), then search for page$
to find all commands ending with the word
“page.”
Knowing how to ask Emacs the right questions
– using apropos or the describe system – is the
cornerstone of Emacs mastery.
Scrolling
Like the arrow keys, the <prior> and <next> commands
(Pg. Up and Pg. Down respectively) have their own Emacs
137

## [p.138]
The Theory of Movement
equivalents, but Emacs’s scrolling mechanism is different
enough that some people find it frustrating. That’s because
Emacs will scroll by nearly full screens, where a full screen is
the number of lines visible in that window. To help with con-
tinuity when you scroll, Emacs will retain two or three lines
(as governed by the variable next-screen-context-lines) so
you don’t lose track of where you are.
Key Binding
Purpose
C-v
Scroll down a near full screen
M-v
Scroll up a near full screen
C-M-v
Scroll down the other window
C-M-S-v
Scroll up the other window
C-v and M-v work the same way as the navigational keys
<prior> and <next>.
The odd ones out are the two commands that scroll the other
window. It has its uses. I almost always work with multiple
windows and being able to scroll another window – contain-
ing a help buffer, or a log file, or even another source code
file – is a common thing for me to do.
Most editors lack this functionality; instead you have to:
Use the mouse With your mouse, move over the window,
and finally use the scroll wheel to scroll up and down,
or click and press <prior> and <next>.
Use the keyboard Switch to the other split window or tab,
use <prior> or <next> to scroll up and down.
138

## [p.139]
The Theory of Movement
In Emacs, you can use the other window scroll commands.
I don’t use C-M-S-v often. I find it easier to type C-M-- C-M-v
to reverse the direction of the scroll with a negative argu-
ment than typing C-M-S-v. The latter command requires a
particularly dexterous finger maneuver and if you scroll too
far, you have to swap finger positions so you can type C-M-v.
It’s far easier to use C-M-- and C-M-v.
Maintaining tempo
Notice that the negative argument command,
C-M--, is conveniently bound to the same modi-
fier keys as C-M-v. Like I explained in the chapter
on universal arguments, this is no coincidence.
By binding the argument commands to all
major modifier combinations, you don’t have
to contort your fingers between commands to
prefix a command with an argument.
You can also scroll horizontally — or just left and right in
Emacs parlance:
Key Binding
Purpose
C-x <
Scroll left
C-<next>
Scroll left
C-<prior>
Scroll right
C-x >
Scroll right
S-<wheel>
Scroll left/right with
the mouse wheel (Emacs 28)
139

## [p.140]
The Theory of Movement
If you edit a lot of text files with very long lines – CSV
files, perhaps – you may want to first disable word wrap-
ping (or line truncation as it’s known in Emacs) with
M-x toggle-truncate-lines. I would not bother memoriz-
ing the horizontal scrolling commands unless you really
need them.
You can, of course, still use the mouse wheel to scroll,
though whether it works in the terminal or not will depend
on your system.
Now for two more commands for moving around, namely
the ability to go to the beginning and end of the buffer:
Key Binding
Purpose
M-<
Move to the beginning of the buffer
M->
Move to the end of the buffer
When you move to the beginning or end of the buffer,
Emacs will place the mark – an invisible location marker
– where you came from, so you can return to your old
position. For instance, if you type M-< to jump to the
beginning of the buffer, you can type C-u C-<SPC> to go
back. C-u, as you remember, is the universal argument; in this
case, it sets a flag so that when you type C-<SPC> Emacs will
interpret that to mean jump to the last mark. The mark,
and its utility in Emacs, is a topic I will discuss a little bit
later.
140

## [p.141]
The Theory of Movement
Bookmarks and Registers
Bookmarks in Emacs are permanent, meaning they are au-
tomatically saved to a bookmark file in ~/.emacs.d/ called
bookmarks.
Bookmark file
The variable bookmark-default-file determines
where Emacs stores your bookmarks. The file is
plain text (elisp s-expressions, actually) meaning
it is possible to edit it manually (if youabsolutely
must) or merge the files if you regularly add or
remove bookmarks from multiple machines.
Key Binding
Purpose
C-x r m
Set a bookmark
C-x r l
List bookmarks
C-x r b
Jump to bookmark
Bookmarks are a very efficient way of jumping to
frequently-used files or directories. Bookmarks also work
if there are sections of Emacs’s manual that you want to
return to frequently. And because of the unified nature of
Emacs – namely buffers – the three are seamlessly stored
and recalled from the same list of bookmarks.
Registers, however, are different; they are the flip side of the
coin — where bookmarks are permanent, registers are tran-
sient. A register is a single-character store-and-recall mecha-
141

## [p.142]
The Theory of Movement
nism for several types of data, including:
Window configurations and framesets You
can
store
and recall the layout of your window configuration,
though I would argue there are much better tools
(such as M-x winner-mode I talked about in Window
Management, and Tab Bar Mode) for the job.
Framesets are identical to window configurations but
hold information about Emacs’s frames instead.
Points The location of point is another thing you can store
in a register. If you are used to line-based bookmarks
from other IDEs or editors, these are the closest equiv-
alents in Emacs. Unfortunately, the key bindings (as
you will see below) diminish their usefulness.
Numbers and text You can also store plain text, making it
a register a better tool than the kill ring if you want
to repeatedly insert text. You can also apply simple
arithmetic operations on a text register if it contains a
number.
Key Binding
Purpose
C-x r n
Store number in register
C-x r s
Store region in register
C-x r SPC
Store point in register
C-x r +
Increment number in register
C-x r j
Jump to register
C-x r i
Insert content of register
C-x r w
Store window configuration in register
C-x r f
Store frameset in register
142

## [p.143]
The Theory of Movement
A register is a single character only. When you want
to store or recall something, you are asked for a single
character to query. Emacs pops up a preview window after
register-preview-delay seconds with a quick overview of
known registers and its contents.
C-x r s is the one I use most frequently. It stores the region
in a register – very practical, and probably what you’ll do
most – and C-x r i which inserts the content of a register at
point. By default the point is placed after the inserted text.
If you give it a prefix argument (C-u C-x r i) it’ll instead
place the point before.
You can store the location of point with C-x r SPC, but to
jump to it you must use C-x r j; arguably C-x r i should
Do The Right Thing here and jump to the point if the reg-
ister stores a point. Instead, Emacs inserts the internal point
location which is not useful at all to anyone.
If you want to store and recall the window or frame layout
– beneficial to anyone who prefers a particular window ar-
rangement – you can store a window or frame configuration
in a register also.
To store a number, place the point before it and type C-x r
n. To increment it by prefix-numeric-value (default 1), type
C-x r +. To increment it by another number, give it a nu-
meric argument (and a negative one to decrement.) You can
recall a number register with C-x r i.
Both registers and bookmarks have their place, but they
serve two different purposes. I would focus on memorizing
the bookmark commands as they persist between sessions.
143

## [p.144]
The Theory of Movement
Selections and Regions
Selecting text is a common action, but in Emacs’s info docu-
mentation and describe system it’s referred to as the region. As
I mentioned in The Point and Mark, a region boundary is
made up of the point and the mark.
Other editors make little or no distinction between the be-
ginning and end of the region but in Emacs that distinction
is rather important. The region is always defined as the block
of text between the point and the mark.
For a visual demonstration, try this in Emacs: press C-<SPC>
In the echo area, a message will appear saying “Mark Set.”
Now, move your point around the buffer – with the arrow
keys or the other movement commands I introduced earlier
– and watch as the region changes because it is now activated.
Press C-<SPC> again – or the universal get-out-of-trouble
command C-g – to deactivate the region. Note that the
region is always defined as the mark to the point, whether
the point comes before the mark or not. This functionality
is thus similar to what you see in other editors when you
hold down shift and move around with the arrow keys.
Therefore, when you make visual selections, you are using
Emacs’s Transient Mark Mode, also known as TMM. TMM came
about much later in Emacs’s history than you might think;
in fact, it was only recently switched on by default.
So what came before TMM? Well, for starters, you didn’t
have visual highlighting at all — so you had to remember
where you left the mark. And a lot of the commands didn’t
know about things like regions at all. Simple commands like
M-x replace-string that does a simple string replacement in
144

## [p.145]
The Theory of Movement
a buffer worked from the point to the end of the buffer, no
exceptions. So if you wanted to modify particular parts of
a buffer, you had to use Emacs’s cryptic narrowing commands
that shrink the visible content of a buffer to what you
wanted the command to act on. As you can imagine, that
didn’t help beginners learn Emacs.
So, today you don’t have to worry about region narrowing
(for anything except specialized editing), nor do you have
to memorize the location of the mark as TMM will show you
the region.
However, the union of TMM and Emacs’s region system is
not perfect. The mark in Emacs is not just for the region.
It’s an important tool for jumping around in a buffer as some
commands that whisk you away from your current location
will leave a mark (a breadcrumb trail, effectively) on the mark
ring that you can return to later. One example would be M-<
and M-> – the commands for jumping to the beginning and
end of the buffer – they both mark your old position before
they jump so you can later return to your old position by
typing C-u C-<SPC>.
The mark ring
Like the undo ring, the mark ring contains all
the marks you have placed in a buffer — both
directly, using mark commands like C-<SPC>;
and indirectly, from commands like M-< and M->.
There is also the global mark ring for commands
that work across buffer boundaries.
You can tell when the mark ring has changed be-
cause the text Mark set (or a variation thereof )
145

## [p.146]
The Theory of Movement
appears in your echo area.
And because of this, the command C-<SPC> will set the mark
and with TMM enabled it also activates the region highlight-
ing when you move the point around. That means if you just
want to set the mark just so you can return to it later (with
C-u C-<SPC>), you have to press C-<SPC> C-<SPC> — once to
set the mark, and once more to deactivate the region. An-
other gotcha is that some commands in Emacs that operate
on regions – text replace, changing text to uppercase in a re-
gion, and so on – work just fine even if the region isn’t activated
as Emacs will not check if the region is active ( just that you
are using TMM.)
Here are the keys needed to activate selection and jump to
the mark. If you are new to Emacs, feel free to use the shift
selection keys until you are comfortable with Emacs’s own
selection mechanism.
Key Binding
Purpose
C-<SPC>
Sets the mark, and toggles the region
C-u C-<SPC>
Jumps to the mark, and repeated calls
go further back the mark ring
S+<left>, …
Shift selection similar to other editors
C-x C-x
Exchanges the point and mark, and
reactivates your last region
The C-x C-x command (called exchange-point-and-mark) is
interesting. It reactivates the region from point – which is
your current location in the buffer – and wherever the mark
is; then, it swaps the point and mark positions. This com-
146

## [p.147]
The Theory of Movement
mand works well when you want to reactivate the last re-
gion or if you simply want to swap the position of mark and
point. Exchanging the point and mark has its place if you
want to edit text near the mark or point or if you simply
want to reactivate the region between your last mark and
point.
Selection Compatibility Modes
To ease the transition to Emacs, there are several helper
modes you can enable to mimic the behavior of other
editors. Emacs enables one or two of them by default now
as part of their drive to modernize Emacs. My personal
recommendation is to start off with what you know and
slowly wean yourself off the compatibility modes as you
improve your Emacs skills.
M-x delete-selection-mode When the region is active and
you type text into the buffer, Emacs will delete the
selected text first. This behavior mimics most other
editors.
To enable (or disable) it, use the customize interface:
M-x customize-option delete-selection-mode
shift-select-mode (variable, enabled by default) Shifted
motion keys – both traditional navigation keys like
the arrow keys and Emacs’s own commands – activate
the region and extend it in the direction you are
moving.
147

## [p.148]
The Theory of Movement
The shift selection works differently from setting the
mark with C-<SPC>. When you shift select a region,
any non-shifted movement command will deactivate
the region. Like delete-selection-mode, this function-
ality mimics the behavior in other editors.
For instance, S-<left>, S-<right>, etc. will region se-
lect one character at a time, and C-S-f will do the same
but with Emacs’s own movement commands.
To disable (or enable) it, use the customize
interface:
M-x customize-option shift-select-mode
M-x cua-mode Probably, the most radical departure from
Emacs’s selection and clipboard system is CUA mode.
Named after IBM’s Common User Access, cua-mode lets
you use C-z, C-x, C-c, and C-v to undo, cut, copy and
paste like you would in other programs.
Because CUA mode and Emacs’s own prefix key bind-
ings C-x and C-c conflict, CUA mode is disabled by de-
fault. If you enable it, the prefix keys C-x and C-c con-
tinue to work but with minor side effects and addi-
tional constraints:
1. To type the prefixes C-x or C-c with an active re-
gion, you must double tap the prefix key in rapid
succession (e.g., C-x C-x).
2. To type the prefix key C-x or C-c followed by an-
other key, you must type them in rapid succes-
sion or you will trigger a clipboard command.
148

## [p.149]
The Theory of Movement
3. Alternatively, to points 1 and 2, you can type the
prefix key with the S- modifier: C-S-x replacing
C-x and C-S-c replacing C-c.
CUA mode is one of those quality of life features that
will make or break Emacs adoption for some people.
If you’re one of them, by all means enable it! You can
always wean yourself off the CUA keys over time or sim-
ply live with the side effects I mentioned.
To enable (or disable) it, use the customize interface:
M-x customize-option cua-mode
My personal recommendation is to learn Emacs’s own re-
gion commands (and more on that shortly) as Emacs was
never designed around the idea of CUA mode.7 Having said
that, eliminating barriers to entry – and this is something
the Emacs maintainers are working on – is more important
in the shorter term for a new Emacs user.
Rectangle Selection
You can ask Emacs to operate on rectangles, which is either
a special mode that changes how the region works, or a set
of rectangle commands that works with or without a region.
I’ll talk about the first use case right now, and leave the rect-
angle commands for later.
7 There was one reason to use CUA mode and that was for its rectan-
gle mode functionality. That functionality is now built in and does not
require CUA mode any more.
149

## [p.150]
The Theory of Movement
Key Binding
Purpose
C-x SPC
Toggle M-x rectangle-mark-mode
on or off
C-x SPC activates rectangle mark mode, which is a minor mode
you can toggle to change how Emacs’s region works. By de-
fault, the region is contiguous, and it will languorously follow
your point from its starting position at the mark, where you
first activated the region. That’s great if you want to mark
everything between mark and point. However, if you put
Emacs in rectangle mode with C-x SPC, it will instead draw a
rectangular selection with the mark being the top-left an-
chor and your point the bottom-right.
Setting the Mark
I have shown you how to activate the mark interactively
with the arrow keys (S+<arrow key>) and C-<SPC> but Emacs
has a host of mark commands that work on syntactic units
which, as you may recall from earlier, are things like words,
s-expressions and paragraphs.
Setting the mark with C-<SPC> is the primary method of acti-
vating the region, but it is cumbersome to use. You have to
set the mark, move to your desired location, and then run
your command. Worse, it breaks your tempo.
If you want to make precise selections, you are better off
using Emacs’s dedicated mark commands:
150

## [p.151]
The Theory of Movement
Key Binding
Purpose
M-h
Marks the next paragraph
C-x h
Marks the whole buffer
C-M-h
Marks the next defun
C-x C-p
Marks the next page
M-@
Marks the next word
C-M-<SPC> and
C-M-@
Marks the next s-expression
C-<SPC>, C-g
Deactivates the region
All mark commands append to the existing selection if you
already have a region active. So if you want to mark two
words in a row, all you have to do is press M-@ twice or com-
bine it with a numeric argument: M-2 M-@. Likewise, you
can reverse the direction by using the negative argument
modifier.
Appending to the existing region has a simple implementa-
tion: Emacs simply moves the mark from one position to the
next. That makes it easy to do topical edits like deleting the
selection or executing a command against it, and you can
daisy-chain as many different mark commands as you like,
until you’ve marked everything you want to mark.
In the chapter What Constitutes a Word? I talked about
syntax tables and how a major mode’s syntax table affects
movement commands. A lot of mark commands are similar,
notably the M-x mark-word command M-@. However, some
mark commands are overridden in some major modes so
they work correctly for that particular mode. For instance,
in reStructuredText, the M-x mark-defun command bound
151

## [p.152]
The Theory of Movement
to C-M-h will select a whole chapter; this is sensible, as
there are no defuns (a LISP term for a function) in a text file.
Not all major modes support M-x mark-defun but most
modes supplied with Emacs do — ultimately it’s down to
the author of the major mode to tell Emacs how to mark
complex things like defuns.
Deactivating the region
Remember, you can deactivate the region with
C-<SPC> or C-g, Emacs’s universal quit command.
I recommend you ignore C-x C-p (the key binding that
marks the next page.) Focus on memorizing C-x h as that
marks the entire buffer; C-M-h, as that will mark the defun;
and C-M-<SPC>, as that will mark by s-expression and will,
in most cases, act the same if it encounters a word.
C-M-<SPC> is one of my most-used commands. Combine it
with a negative argument (C-M-- C-M-<SPC>) to reverse the
direction and you can mark s-expressions in reverse easily
too.
Finally, a lot of manual marking is redundant if you follow
it up with a kill8 command, as Emacs has its own kill
commands that act on syntactic units directly. I will go into
much greater detail about the kill command later on in The
Theory of Editing.
Summary
Let’s finish with a list of simple rules to remember:
8 As you may recall, the word kill means cut in Emacs.
152

## [p.153]
The Theory of Movement
1. A region is a block bounded by the point and mark,
though rectangle mark mode changes the boundaries.
You can visually see the difference between the two
if you toggle between them.
2. You activate a region with C-<SPC>, which sets the
mark and then activates the region. Pressing C-<SPC>
again deactivates the region.
3. An active region follows the point as you move around
but breaks when you use a non-movement command.
4. The mark serves a dual purpose as a beacon you can
return to with C-u C-<SPC>. Some commands may set
the mark for you; it can be set explicitly with C-<SPC>.
Repeat calls to C-u C-<SPC> go further and further
back the mark ring.
5. Exchanging the point and mark with C-x C-x re-
activates the region and switches your point and mark
around.
6. Some Emacs commands don’t care if the region isn’t
actually active and work anyway (so be careful).
The reason for this discrepancy in behavior is due to
TMM, Emacs’s transient mark mode, and the need to re-
tain backwards compatibility so commands continue
to work without TMM enabled.
As always, I encourage you to learn Emacs’s own commands
in time but, if you want a return to familiarity, you can use
153

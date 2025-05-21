let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Programs/interviews.d/avantos.1df53c
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +22 src/App.tsx
badd +0 src/vite-env.d.ts
badd +13 index.html
badd +0 public/fa-heart.svg
badd +10 src/main.tsx
badd +232 ~/Programs/interviews.d/avantos.1df53c/node_modules/@xyflow/react/dist/esm/types/component-props.d.ts
badd +13 src/App.css
badd +59 ~/Programs/interviews.d/avantos.1df53c/node_modules/@xyflow/react/dist/esm/additional-components/Background/Background.d.ts
badd +27 ~/Programs/interviews.d/avantos.1df53c/node_modules/@xyflow/react/dist/esm/additional-components/Controls/Controls.d.ts
badd +1529 ~/Programs/interviews.d/avantos.1df53c/node_modules/@types/react/index.d.ts
badd +16 src/index.css
badd +0 eslint.config.js
argglobal
%argdel
$argadd src/App.tsx
edit src/App.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 89 + 90) / 180)
exe 'vert 2resize ' . ((&columns * 90 + 90) / 180)
argglobal
balt ~/Programs/interviews.d/avantos.1df53c/node_modules/@xyflow/react/dist/esm/additional-components/Controls/Controls.d.ts
setlocal foldmethod=expr
setlocal foldexpr=nvim_treesitter#foldexpr()
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=99
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
let s:l = 28 - ((27 * winheight(0) + 33) / 66)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 28
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("eslint.config.js", ":p")) | buffer eslint.config.js | else | edit eslint.config.js | endif
if &buftype ==# 'terminal'
  silent file eslint.config.js
endif
balt src/index.css
setlocal foldmethod=expr
setlocal foldexpr=nvim_treesitter#foldexpr()
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=99
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
7
sil! normal! zo
9
sil! normal! zo
20
sil! normal! zo
let s:l = 27 - ((26 * winheight(0) + 33) / 66)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 27
normal! 024|
wincmd w
exe 'vert 1resize ' . ((&columns * 89 + 90) / 180)
exe 'vert 2resize ' . ((&columns * 90 + 90) / 180)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :

<?php
$activePage = $_GET['page'] ?? 'overview';
$submitted = $_SERVER['REQUEST_METHOD'] === 'POST';
$submissionType = $_POST['submission_type'] ?? '';
$navItems = [
	['id' => 'overview', 'label' => 'Overview', 'icon' => 'grid'],
	['id' => 'souls', 'label' => 'Souls & first-timers', 'icon' => 'users'],
	['id' => 'pipeline', 'label' => 'Follow-up pipeline', 'icon' => 'route'],
	['id' => 'campaigns', 'label' => 'Outreach campaigns', 'icon' => 'send'],
	['id' => 'reports', 'label' => 'Reports & insights', 'icon' => 'chart'],
];
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Manifest Fellowship | KIU Follow Up</title>
	<style>
		:root { --ink: #17211d; --muted: #7d8780; --line: #e4e9e2; --cream: #f7f8f4; --white: #fff; --green: #215c48; --mint: #dcefe5; --lime: #d8e977; --amber: #f5c86d; --coral: #ee8e78; --blue: #9fcae8; }
		* { box-sizing: border-box; }
		body { margin: 0; color: var(--ink); background: var(--cream); font: 14px/1.45 "Trebuchet MS", "Segoe UI", sans-serif; }
		button, input, select { font: inherit; }
		button { cursor: pointer; }
		.app { display: flex; min-height: 100vh; }
		.sidebar { position: fixed; inset: 0 auto 0 0; width: 248px; display: flex; flex-direction: column; padding: 28px 18px 18px; color: #dce9df; background: var(--green); }
		.brand { display: flex; align-items: center; gap: 11px; padding: 0 12px 42px; color: white; font-weight: 700; letter-spacing: -.02em; font-size: 17px; }
		.brand-mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; color: var(--green); background: var(--lime); font-weight: 900; }
		.nav-label { margin: 0 12px 12px; color: #8eb5a0; font-size: 10px; text-transform: uppercase; letter-spacing: .14em; }
		.nav { display: grid; gap: 5px; }
		.nav a { display: flex; align-items: center; gap: 13px; padding: 11px 12px; border-radius: 8px; color: #c8d9ce; text-decoration: none; }
		.nav a:hover, .nav a.active { color: white; background: rgba(255,255,255,.12); }
		.nav a.active { box-shadow: inset 3px 0 var(--lime); }
		.nav svg { width: 17px; height: 17px; stroke: currentColor; fill: none; stroke-width: 1.8; }
		.side-bottom { margin-top: auto; padding: 17px 12px 0; border-top: 1px solid rgba(255,255,255,.14); }
		.profile { display: flex; align-items: center; gap: 10px; }
		.avatar { display: grid; place-items: center; width: 35px; height: 35px; border-radius: 50%; color: var(--green); background: var(--lime); font-weight: 700; font-size: 12px; }
		.profile strong { display: block; color: white; font-size: 12px; }
		.profile small { color: #9eb7a6; font-size: 10px; }
		.main { width: calc(100% - 248px); margin-left: 248px; padding: 25px 38px 50px; }
		.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 34px; }
		.crumb { color: var(--muted); font-size: 12px; }
		.crumb b { color: var(--ink); font-weight: 600; }
		.top-actions { display: flex; align-items: center; gap: 19px; }
		.icon-btn { position: relative; display: grid; place-items: center; border: 0; background: none; color: #59645d; }
		.icon-btn svg { width: 19px; height: 19px; stroke: currentColor; fill: none; stroke-width: 1.7; }
		.dot { position: absolute; top: -2px; right: -3px; width: 6px; height: 6px; border: 1px solid var(--cream); border-radius: 50%; background: var(--coral); }
		.role { padding: 8px 12px; border: 1px solid var(--line); border-radius: 5px; color: #516057; background: white; font-size: 11px; }
		h1, h2, h3, p { margin-top: 0; }
		h1 { margin-bottom: 5px; font-size: clamp(25px, 3vw, 36px); letter-spacing: -.055em; font-weight: 700; }
		.intro { margin-bottom: 27px; color: var(--muted); }
		.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 27px; }
		.metric { position: relative; min-height: 124px; padding: 18px 19px; border: 1px solid var(--line); border-radius: 9px; background: var(--white); overflow: hidden; }
		.metric:after { position: absolute; right: -17px; bottom: -28px; width: 82px; height: 82px; border-radius: 50%; background: var(--mint); content: ""; }
		.metric:nth-child(2):after { background: #eef1bd; } .metric:nth-child(3):after { background: #f9ddcf; } .metric:nth-child(4):after { background: #d8e9f1; }
		.metric-label { color: var(--muted); font-size: 11px; }
		.metric-number { display: block; margin: 6px 0 4px; font-size: 30px; letter-spacing: -.06em; }
		.trend { position: relative; z-index: 1; color: var(--green); font-size: 11px; font-weight: 700; }
		.trend.neutral { color: var(--muted); font-weight: 400; }
		.content-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, .8fr); gap: 18px; }
		.panel { border: 1px solid var(--line); border-radius: 9px; background: var(--white); }
		.panel-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 21px 15px; }
		.panel-head h2 { margin: 0; font-size: 15px; letter-spacing: -.02em; }
		.panel-head a { color: var(--green); font-size: 11px; font-weight: 700; text-decoration: none; }
		.pipeline { display: grid; grid-template-columns: repeat(6, minmax(90px, 1fr)); gap: 8px; padding: 8px 21px 23px; overflow-x: auto; }
		.stage { min-width: 92px; }
		.stage-name { min-height: 31px; color: var(--muted); font-size: 10px; line-height: 1.25; }
		.stage-count { display: block; margin-bottom: 8px; font-size: 23px; }
		.stage-bar { height: 5px; border-radius: 6px; background: var(--mint); } .stage:nth-child(2) .stage-bar { background: #e5ecb4; } .stage:nth-child(3) .stage-bar { background: var(--amber); } .stage:nth-child(4) .stage-bar { background: var(--coral); } .stage:nth-child(5) .stage-bar { background: var(--blue); } .stage:nth-child(6) .stage-bar { background: #85ba8d; }
		.tasks { padding: 0 21px 12px; }
		.task { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-top: 1px solid #edf0ec; }
		.task-avatar { flex: 0 0 32px; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; color: var(--green); background: #e9f2e8; font-size: 11px; font-weight: 700; }
		.task-main { flex: 1; min-width: 0; } .task-main strong { display: block; font-size: 12px; } .task-main span { display: block; overflow: hidden; color: var(--muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
		.task-due { color: #bd654f; font-size: 10px; white-space: nowrap; } .task-due.today { color: var(--green); }
		.side-panel { padding-bottom: 18px; }
		.quick { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; padding: 3px 21px 20px; }
		.quick button { min-height: 74px; padding: 10px; border: 1px solid var(--line); border-radius: 6px; color: var(--ink); background: #fbfcfa; text-align: left; font-size: 11px; }
		.quick button:hover { border-color: var(--green); background: var(--mint); }
		.quick-icon { display: block; margin-bottom: 7px; color: var(--green); font-size: 19px; line-height: 1; }
		.activity { margin: 0 21px; padding-top: 15px; border-top: 1px solid #edf0ec; }
		.activity h3 { margin-bottom: 11px; font-size: 12px; } .activity-row { display: flex; gap: 10px; margin: 10px 0; color: var(--muted); font-size: 10px; } .activity-row b { color: var(--ink); font-weight: 600; }
		.activity-mark { width: 6px; height: 6px; margin-top: 5px; border-radius: 50%; background: var(--lime); }
		.page-heading { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:24px; }
		.page-heading h1 { margin-bottom:4px; }
		.page-heading p { margin-bottom:0; color:var(--muted); }
		.primary-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 14px; border:0; border-radius:6px; color:var(--green); background:var(--lime); font-weight:700; font-size:12px; text-decoration:none; }
		.filter-row { display:flex; flex-wrap:wrap; gap:9px; margin-bottom:16px; }
		.filter-row input, .filter-row select, .form-grid input, .form-grid select, .form-grid textarea { width:100%; padding:10px 11px; border:1px solid var(--line); border-radius:5px; color:var(--ink); background:white; }
		.filter-row input { max-width:290px; }
		.table-wrap { overflow-x:auto; }
		table { width:100%; border-collapse:collapse; text-align:left; }
		th { padding:12px 20px; color:var(--muted); background:#fafbf9; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; }
		td { padding:14px 20px; border-top:1px solid #edf0ec; font-size:12px; white-space:nowrap; }
		td strong { display:block; }
		td small { color:var(--muted); }
		.status { display:inline-block; padding:4px 7px; border-radius:12px; color:var(--green); background:var(--mint); font-size:10px; }
		.status.warn { color:#996334; background:#fff1d0; }
		.status.coral { color:#a34e3d; background:#fbe1d9; }
		.form-panel { max-width:760px; padding:24px; }
		.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
		.form-field { display:grid; gap:6px; }
		.form-field.full { grid-column:1 / -1; }
		.form-field label { color:var(--muted); font-size:11px; }
		.form-grid textarea { min-height:96px; resize:vertical; }
		.notice { margin-bottom:18px; padding:12px 14px; border-left:3px solid var(--green); color:var(--green); background:var(--mint); font-size:12px; }
		.bars { display:grid; gap:15px; padding:0 21px 22px; }
		.bar-line { display:grid; grid-template-columns:120px 1fr 40px; align-items:center; gap:12px; color:var(--muted); font-size:11px; }
		.bar-track { height:9px; border-radius:5px; background:#eef2ed; overflow:hidden; }
		.bar-fill { height:100%; border-radius:inherit; background:var(--green); }
		@media (max-width:720px) { .page-heading { display:block; } .page-heading .primary-btn { margin-top:14px; } .form-grid { grid-template-columns:1fr; } .form-field.full { grid-column:auto; } .bar-line { grid-template-columns:90px 1fr 30px; gap:7px; } }
		.mobile-menu { display: none; }
		@media (max-width: 1050px) { .metric-grid { grid-template-columns: repeat(2, 1fr); } .content-grid { grid-template-columns: 1fr; } }
		@media (max-width: 720px) { .sidebar { position: static; width: 100%; height: auto; padding: 15px; } .app { display: block; } .brand { padding: 0 4px 17px; } .nav-label, .side-bottom { display: none; } .nav { display: flex; overflow-x: auto; gap: 3px; } .nav a { padding: 8px 9px; font-size: 11px; white-space: nowrap; } .nav svg { display: none; } .main { width: 100%; margin: 0; padding: 21px 16px 35px; } .topbar { margin-bottom: 26px; } .crumb { font-size: 11px; } .role { display: none; } h1 { font-size: 29px; } .metric-grid { gap: 9px; } .metric { min-height: 109px; padding: 13px; } .metric-number { font-size: 25px; } .metric-label { font-size: 10px; } }
	</style>
</head>
<body>
<div class="app">
	<aside class="sidebar">
		<div class="brand"><span class="brand-mark">M</span> Manifest Fellowship</div>
		<div class="nav-label">Ministry workspace</div>
		<nav class="nav">
			<?php foreach ($navItems as $item): ?>
				<a class="<?php echo $activePage === $item['id'] ? 'active' : ''; ?>" href="?page=<?php echo $item['id']; ?>">
					<?php if ($item['icon'] === 'grid'): ?><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg><?php endif; ?>
					<?php if ($item['icon'] === 'users'): ?><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c.4-3.2 2.3-5 6-5s5.6 1.8 6 5M16 5.5a3 3 0 0 1 0 5.8M17 15c2.4.5 3.7 2.1 4 5"/></svg><?php endif; ?>
					<?php if ($item['icon'] === 'route'): ?><svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v4c0 2 2 3 4 3h4c2 0 4 1 4 3v0"/></svg><?php endif; ?>
					<?php if ($item['icon'] === 'send'): ?><svg viewBox="0 0 24 24"><path d="m21 3-7.5 18-3.3-7.2L3 10.5 21 3Z"/><path d="m10.2 13.8 4-4"/></svg><?php endif; ?>
					<?php if ($item['icon'] === 'chart'): ?><svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-6M20 16v-9"/></svg><?php endif; ?>
					<?php echo htmlspecialchars($item['label']); ?>
				</a>
			<?php endforeach; ?>
		</nav>
		<div class="nav-label" style="margin-top:25px">Public forms</div>
		<nav class="nav"><a href="?page=intake">New visitor intake</a><a href="?page=join-team">Join follow-up team</a></nav>
		<div class="side-bottom"><div class="profile"><span class="avatar">DO</span><div><strong>David O.</strong><small>Super Admin · Pastor</small></div></div></div>
	</aside>
	<main class="main">
		<header class="topbar"><div class="crumb">Workspace / <b><?php echo ucfirst(str_replace('-', ' ', $activePage)); ?></b></div><div class="top-actions"><button class="icon-btn" aria-label="Notifications"><span class="dot"></span><svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg></button><span class="role">Super Admin <span aria-hidden="true">⌄</span></span></div></header>
		<?php if ($submitted): ?><div class="notice">Your <?php echo htmlspecialchars($submissionType === 'intake' ? 'intake record' : 'application'); ?> was received and is ready for review.</div><?php endif; ?>
		<?php if ($activePage === 'souls'): ?>
		<section class="page-heading"><div><h1>Souls & first-timers</h1><p>Keep every new connection visible, assigned, and cared for.</p></div><a class="primary-btn" href="#new">+ Add a soul</a></section>
		<div class="filter-row"><input aria-label="Search souls" placeholder="Search by name or phone"><select aria-label="Filter status"><option>All statuses</option><option>New</option><option>Assigned</option><option>Contacted</option><option>Visited</option><option>Integrated</option></select><select aria-label="Filter source"><option>All sources</option><option>Sunday service</option><option>Outreach</option><option>Fellowship</option></select></div>
		<section class="panel table-wrap"><table><thead><tr><th>Person</th><th>Source</th><th>Zone</th><th>Status</th><th>Next follow-up</th></tr></thead><tbody>
			<tr><td><strong>Amara Mensah</strong><small>New Convert · +233 24 555 0192</small></td><td>Sunday service</td><td>Zone 2</td><td><span class="status warn">Contacted</span></td><td>Today</td></tr>
			<tr><td><strong>Joshua Okoro</strong><small>First-timer · +234 803 441 8820</small></td><td>Outreach</td><td>Zone 4</td><td><span class="status">Assigned</span></td><td>Today</td></tr>
			<tr><td><strong>Ruth Nwosu</strong><small>Rededication · +234 806 110 7744</small></td><td>Fellowship</td><td>Zone 2</td><td><span class="status coral">Needs visit</span></td><td>Tomorrow</td></tr>
		</tbody></table></section>
		<section id="new" class="panel form-panel" style="margin-top:18px"><div class="panel-head" style="padding:0 0 17px"><h2>New intake record</h2></div><form method="post"><input type="hidden" name="submission_type" value="intake"><div class="form-grid"><div class="form-field"><label for="name">Full name</label><input id="name" name="name" required></div><div class="form-field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" required></div><div class="form-field"><label for="source">Source</label><select id="source" name="source"><option>Sunday service</option><option>Fellowship</option><option>Outreach</option><option>Personal evangelism</option></select></div><div class="form-field"><label for="type">Soul type</label><select id="type" name="type"><option>First-timer</option><option>New convert</option><option>Rededication</option><option>Visitor</option></select></div><div class="form-field full"><label for="prayer">Prayer request or notes</label><textarea id="prayer" name="prayer"></textarea></div></div><button class="primary-btn" type="submit" style="margin-top:16px">Save intake</button></form></section>
		<?php elseif ($activePage === 'pipeline'): ?>
		<section class="page-heading"><div><h1>Follow-up pipeline</h1><p>Match unassigned souls with available workers by zone and workload.</p></div><a class="primary-btn" href="?page=souls#new">+ Add intake</a></section>
		<section class="metric-grid"><article class="metric"><span class="metric-label">Unassigned</span><strong class="metric-number">14</strong><span class="trend" style="color:#bd654f">Needs attention</span></article><article class="metric"><span class="metric-label">Active workers</span><strong class="metric-number">32</strong><span class="trend">84% available</span></article><article class="metric"><span class="metric-label">Due this week</span><strong class="metric-number">27</strong><span class="trend neutral">Across 6 zones</span></article><article class="metric"><span class="metric-label">Completed</span><strong class="metric-number">91</strong><span class="trend">↑ 12% this month</span></article></section>
		<section class="panel table-wrap"><div class="panel-head"><h2>Assignment queue</h2><a href="?page=pipeline">Auto-assign by zone →</a></div><table><thead><tr><th>New soul</th><th>Zone</th><th>Age</th><th>Suggested worker</th><th>Action</th></tr></thead><tbody><tr><td><strong>Daniel Boateng</strong><small>First-timer · Sunday service</small></td><td>Zone 1</td><td>2 days</td><td>Grace W.</td><td><button class="primary-btn" type="button" onclick="this.textContent='Assigned'">Assign</button></td></tr><tr><td><strong>Esther Adeyemi</strong><small>Visitor · Outreach</small></td><td>Zone 3</td><td>1 day</td><td>Samuel K.</td><td><button class="primary-btn" type="button" onclick="this.textContent='Assigned'">Assign</button></td></tr></tbody></table></section>
		<?php elseif ($activePage === 'campaigns'): ?>
		<section class="page-heading"><div><h1>Outreach campaigns</h1><p>Coordinate messages and reminders without losing the personal touch.</p></div><button class="primary-btn" type="button" onclick="alert('Campaign composer ready for your SMS or WhatsApp integration.')">+ New campaign</button></section>
		<section class="content-grid"><article class="panel"><div class="panel-head"><h2>Active campaigns</h2></div><div class="tasks"><div class="task"><span class="task-avatar">W</span><div class="task-main"><strong>Welcome message · Sunday service</strong><span>SMS · 24 recipients · sent 2 hours ago</span></div><span class="status">Active</span></div><div class="task"><span class="task-avatar" style="background:#f8e6db">F</span><div class="task-main"><strong>Foundation class reminder</strong><span>WhatsApp · 18 recipients · scheduled Friday</span></div><span class="status warn">Scheduled</span></div></div></article><article class="panel form-panel"><div class="panel-head" style="padding:0 0 17px"><h2>Channels</h2></div><p class="intro">Connect your preferred provider when the backend is ready.</p><div class="task"><span class="task-avatar">S</span><div class="task-main"><strong>SMS gateway</strong><span>Twilio or local provider</span></div><span class="status warn">Setup</span></div><div class="task"><span class="task-avatar">W</span><div class="task-main"><strong>WhatsApp Business</strong><span>Meta Cloud API</span></div><span class="status warn">Setup</span></div></article></section>
		<?php elseif ($activePage === 'reports'): ?>
		<section class="page-heading"><div><h1>Reports & insights</h1><p>See where care is moving forward and where your team needs support.</p></div><button class="primary-btn" type="button" onclick="window.print()">Export report</button></section>
		<section class="panel"><div class="panel-head"><h2>Conversion journey this quarter</h2><span class="crumb">April - June 2026</span></div><div class="bars"><div class="bar-line"><span>New intake</span><div class="bar-track"><div class="bar-fill" style="width:100%"></div></div><b>248</b></div><div class="bar-line"><span>Contacted</span><div class="bar-track"><div class="bar-fill" style="width:74%;background:var(--amber)"></div></div><b>184</b></div><div class="bar-line"><span>Visited</span><div class="bar-track"><div class="bar-fill" style="width:42%;background:var(--coral)"></div></div><b>104</b></div><div class="bar-line"><span>Integrated</span><div class="bar-track"><div class="bar-fill" style="width:29%;background:#85ba8d"></div></div><b>72</b></div></div></section>
		<?php elseif ($activePage === 'intake' || $activePage === 'join-team'): ?>
		<section class="page-heading"><div><h1><?php echo $activePage === 'intake' ? 'Welcome to Manifest' : 'Join the follow-up team'; ?></h1><p><?php echo $activePage === 'intake' ? 'Share your details and a member of our care team will reach out soon.' : 'Offer your time and gifts to help people take their next step.'; ?></p></div></section><section class="panel form-panel"><form method="post"><input type="hidden" name="submission_type" value="<?php echo $activePage === 'intake' ? 'intake' : 'application'; ?>"><div class="form-grid"><div class="form-field"><label for="public-name">Full name</label><input id="public-name" name="name" required></div><div class="form-field"><label for="public-phone">Phone number</label><input id="public-phone" name="phone" type="tel" required></div><div class="form-field"><label for="public-email">Email address</label><input id="public-email" name="email" type="email"></div><div class="form-field"><label for="public-zone">Preferred zone</label><input id="public-zone" name="zone" placeholder="e.g. Zone 2"></div><div class="form-field full"><label for="public-notes"><?php echo $activePage === 'intake' ? 'Prayer request' : 'Why would you like to serve?'; ?></label><textarea id="public-notes" name="notes"></textarea></div></div><button class="primary-btn" type="submit" style="margin-top:16px">Submit</button></form></section>
		<?php else: ?>
		<section><h1>Good morning, Pastor David.</h1><p class="intro">Here’s what’s happening across your follow-up ministry today.</p></section>
		<section class="metric-grid" aria-label="Ministry metrics">
			<article class="metric"><span class="metric-label">Total souls</span><strong class="metric-number">248</strong><span class="trend">↑ 12% <span class="trend neutral">vs last month</span></span></article>
			<article class="metric"><span class="metric-label">New this month</span><strong class="metric-number">36</strong><span class="trend">↑ 8% <span class="trend neutral">vs last month</span></span></article>
			<article class="metric"><span class="metric-label">Awaiting first contact</span><strong class="metric-number">14</strong><span class="trend" style="color:#bd654f">Needs attention</span></article>
			<article class="metric"><span class="metric-label">Integrated members</span><strong class="metric-number">72</strong><span class="trend">↑ 16% <span class="trend neutral">this quarter</span></span></article>
		</section>
		<section class="content-grid">
			<article class="panel"><div class="panel-head"><h2>Follow-up journey</h2><a href="?page=pipeline">View pipeline →</a></div><div class="pipeline">
				<div class="stage"><span class="stage-name">New intake</span><strong class="stage-count">24</strong><div class="stage-bar"></div></div><div class="stage"><span class="stage-name">Assigned</span><strong class="stage-count">18</strong><div class="stage-bar"></div></div><div class="stage"><span class="stage-name">First contacted</span><strong class="stage-count">31</strong><div class="stage-bar"></div></div><div class="stage"><span class="stage-name">Visited</span><strong class="stage-count">9</strong><div class="stage-bar"></div></div><div class="stage"><span class="stage-name">Cell group</span><strong class="stage-count">12</strong><div class="stage-bar"></div></div><div class="stage"><span class="stage-name">Integrated</span><strong class="stage-count">72</strong><div class="stage-bar"></div></div>
			</div><div class="panel-head" style="padding-top:8px"><h2>Today’s follow-ups</h2><a href="?page=souls">See all →</a></div><div class="tasks">
				<div class="task"><span class="task-avatar">AM</span><div class="task-main"><strong>Amara Mensah</strong><span>Call · New Convert · assigned to you</span></div><span class="task-due today">Due today</span></div>
				<div class="task"><span class="task-avatar" style="background:#f8e6db">JO</span><div class="task-main"><strong>Joshua Okoro</strong><span>Home visit · First-timer · Zone 4</span></div><span class="task-due">Due today</span></div>
				<div class="task"><span class="task-avatar" style="background:#e4eafa">RN</span><div class="task-main"><strong>Ruth Nwosu</strong><span>WhatsApp · Rededication · Zone 2</span></div><span class="task-due">Tomorrow</span></div>
			</div></article>
			<aside class="panel side-panel"><div class="panel-head"><h2>Quick actions</h2></div><div class="quick"><button onclick="location.href='?page=souls#new'" type="button"><span class="quick-icon">＋</span>Add a soul</button><button onclick="location.href='?page=pipeline'" type="button"><span class="quick-icon">↗</span>Assign follow-ups</button><button onclick="location.href='?page=campaigns'" type="button"><span class="quick-icon">◌</span>Start campaign</button><button onclick="location.href='?page=reports'" type="button"><span class="quick-icon">⌁</span>View reports</button></div><div class="activity"><h3>Recent activity</h3><div class="activity-row"><span class="activity-mark"></span><span><b>Grace W.</b> logged a home visit<br>12 minutes ago</span></div><div class="activity-row"><span class="activity-mark" style="background:var(--amber)"></span><span><b>New intake</b> from Sunday service<br>38 minutes ago</span></div><div class="activity-row"><span class="activity-mark" style="background:var(--blue)"></span><span><b>Samuel K.</b> completed foundation class<br>1 hour ago</span></div></div></aside>
		</section>
		<?php endif; ?>
	</main>
</div>
</body>
</html>
   
const DugSearch = ({ data }) => {
  return (
    <div className="prose-lg container pb-12 event-html text-gray-dark text-xl">
      <form>
        <input type="text" id="dug-search" placeholder={data.placeholder} />
      </form>
    </div>
  )
}

export default DugSearch
